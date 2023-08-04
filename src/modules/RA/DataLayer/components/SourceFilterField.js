import React from 'react';
import {
  useTranslate,
  useInput,
} from 'react-admin';

import { useField } from 'react-final-form';
import { visit } from 'unist-util-visit';
import debounce  from 'lodash.debounce';

import searchService from '@terralego/core/modules/Visualizer/services/search';

import parser from 'pivotql/packages/pivotql-parser-expression/src';
import compilerEs from 'pivotql-compiler-elasticsearch';

import TextField from '@material-ui/core/TextField';
import IconHelp from '@material-ui/icons/Help';
import ErrorIcon from '@material-ui/icons/Error';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ListIcon from '@material-ui/icons/FormatListBulleted';

import FieldOption from './tabs/FieldOption';
import useSourceData from './useSourceData';


const SourceFilterField = props => {
  const translate = useTranslate();
  const mountedRef = React.useRef(true);

  const [showHelp, setShowHelp] = React.useState(false);
  const [showFields, setShowFields] = React.useState(false);
  const [featureCount, setFeatureCount] = React.useState(null);
  const [totalCount, setTotalCount] = React.useState(null);

  const sourceData = useSourceData('source');

  const { input: { value: fields } } = useField('fields');

  const { label, disabled, helperText } = props;

  // Mounted Guard
  React.useEffect(() => () => { mountedRef.current = false; }, []);

  /**
   * Compute a list of all field names
   */
  const fieldNames = React.useMemo(
    () => fields.map(({ name }) => name),
    [fields],
  );

  /**
   * Validate the input expression
   */
  const validateSourceFilter = React.useCallback(value => {
    if (!value) {
      // Empty value is just fine
      return undefined;
    }
    try {
      const ast = parser(value);
      const notFound = [];
      // Check whether symbol exists
      visit(ast, 'SYMBOL', ({ value: name }) => {
        if (!fieldNames.includes(name)) {
          notFound.push(name);
        }
      });
      // With have not found symbol
      if (notFound.length) {
        return { missing: notFound[0] };
      }
      // If we get there, then the expression is valid
      return undefined;
    } catch (e) {
      // Parse as failed, return parse error
      return e.hash;
    }
  }, [fieldNames]);


  const {
    input: { name, onChange, value, ...rest },
    meta: { touched, error },
    isRequired,
  } = useInput({ ...props, validate: validateSourceFilter });

  React.useEffect(() => {
    /**
     * Update feature total
     */
    if (!sourceData.slug) {
      return;
    }

    const setTotal = async () => {
      const result = await searchService.search({
        index: sourceData.slug,
        include: [],
        size: 0,
      });
      if (!mountedRef.current) {
        return;
      }
      setTotalCount(result.hits.total.value);
    };

    setTotal();
  }, [sourceData.slug]);

  /**
   * Debounced function to update result count.
   */
  const updateResultCount = React.useMemo(
    () => debounce(async computedQuery => {
      if (!sourceData.slug) {
        return;
      }
      let count = 0;
      try {
        const { responses: [{ hits: { total: { value: resultCount } } }] } =
          await searchService.msearch([{
            index: sourceData.slug,
            include: [],
            baseQuery: computedQuery,
            size: 0,
          }]);
        count = resultCount;
      } catch (e) {
        count = 0;
      }
      if (!mountedRef.current) {
        return;
      }
      setFeatureCount(count);
    }, 1000),
    [sourceData],
  );

  React.useEffect(() => {
    /**
     * update filtered feature count
     */
    if (!error) {
      try {
        const compiled = compilerEs(parser(value));
        updateResultCount(compiled);
      } catch {
        // Do nothing
      }
    }
  }, [value, error, updateResultCount]);


  let errorMessage;
  if (error) {
    errorMessage = translate(
      !error.loc && !error.missing
        ? 'datalayer.form.source-filter.error-invalid'
        : 'datalayer.form.source-filter.error',
    );
  }

  const helperContent = (
    (totalCount !== null && featureCount !== null && value)
      ? translate('datalayer.form.source-filter.feature-count', { count: featureCount, total: totalCount })
      : helperText
  );

  const helper = (
    <>
      {!touched ?
        helperContent :
        errorMessage || helperContent}
    </>
  );


  return (
    <div style={{ paddingBottom: '1.5em' }}>
      <div style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
        <div
          style={{ flex: '1', marginRight: '1em' }}
        >
          <TextField
            variant="filled"
            name={name}
            value={value}
            disabled={disabled}
            label={translate(label)}
            onChange={onChange}
            error={!!(touched && error)}
            helperText={helper}
            required={isRequired}
            style={{ width: '100%' }}
            {...rest}
          />
        </div>
        <ButtonGroup
          variant="outlined"
          color="primary"
          style={{ marginTop: '-25px' }}
        >
          <Button
            onClick={() => setShowFields(true)}
            startIcon={<ListIcon />}
          >
            {translate('datalayer.form.source-filter.show-fields')}
          </Button>
          <Button
            onClick={() => setShowHelp(true)}
            key="button"
          >
            <IconHelp />
          </Button>
        </ButtonGroup>

      </div>
      {touched && (
      <>
        { error?.loc && (
          <p>
            <span style={{ color: '#777777' }}>
              {translate('datalayer.form.source-filter.error-localisation')}
            </span>
            {value.slice(0, error.loc.last_column)}
            <span style={{ bottom: '-5px', position: 'relative' }}>
              <ErrorIcon fontSize="small" color="error" />
            </span>
            {value.slice(error.loc.last_column)}
          </p>
        )}
        { error?.missing && (
          <p>
            {translate('datalayer.form.source-filter.error-missing', { missing: error.missing })}
          </p>
        )}
      </>
      )}
      <Dialog open={showHelp} onClose={() => setShowHelp(false)}>
        <DialogTitle>{ translate('datalayer.form.source-filter.help-title')}</DialogTitle>
        <DialogContent>
          <p>{ translate('datalayer.form.source-filter.help-intro')}</p>
          <ul>
            <li>population &gt; 2000</li>
            <li>surface &gt; 200 and surface &lt; 1000</li>
            <li>status in ["ACCEPTED", "DONE"]</li>
            <li>name != undefined and name != null and name != ""</li>
            <li>
              age == 18
              and status in ["ACCEPTED", "DONE"]
              and (surface &lt; 200 or surface &gt; 1000)
              and population &gt; 2000
            </li>
          </ul>
          <p>{ translate('datalayer.form.source-filter.help-operators')}</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowHelp(false)}>Ok</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={showFields} onClose={() => setShowFields(false)}>
        <DialogTitle>{ translate('datalayer.form.source-filter.show-fields-title')}</DialogTitle>
        <DialogContent>
          <p>{ translate('datalayer.form.source-filter.show-fields-intro')}</p>
          <ul>
            {fields.map(
              field => (
                <li key={name}>
                  <FieldOption record={{ ...field, dataType: field.data_type }} nameFirst />
                </li>
              ),
            )}
          </ul>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowFields(false)}>Ok</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};


export default SourceFilterField;
