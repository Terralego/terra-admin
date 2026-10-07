import React, { useCallback, useMemo } from 'react';
import debounce from 'lodash.debounce';

import {
  TextInput,
  BooleanInput,
  useTranslate,
} from 'react-admin';

import { Field, useField, useForm } from 'react-final-form';

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';

import MiniSheetFieldTree from './MiniSheetFieldTree';

import Placeholder from '../../../../../../components/Placeholder';
import ColorPicker from '../../../../../../components/react-admin/ColorPicker';
import HelpContent from '../../../../../../components/react-admin/HelpContent';
import FieldGroup from '../../../../../../components/react-admin/FieldGroup';
import Condition from '../../../../../../components/react-admin/Condition';
import useSourceData from '../../useSourceData';
import createTemplate from './minisheetTemplate';

const useStyles = makeStyles({
  colorPicker: {
    width: '25%',
  },
  placeholder: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    borderBottom: 'thin solid grey',
    marginBottom: '25px',
  },
});


const MinisheetTab = () => {
  const classes = useStyles();
  const translate = useTranslate();
  const form = useForm();
  const { geom_type: geomType, id: sourceId } = useSourceData('source');

  const { input: { value: fields } } = useField('fields');

  const getAvailableFields = useCallback(() => {
    const {
      values: {
        minisheet_config: {
          wizard: {
            tree: treeData = [],
          } = {},
        } = {},
      },
    } = form.getState();

    if (!treeData.length > 0) {
      return fields;
    }

    const wizardFieldIds =  treeData.flatMap(({ group, sourceFieldId, children = [] }) =>
      (group ? children.map(({ sourceFieldId: id }) => id) : sourceFieldId));

    return fields.filter(field => !wizardFieldIds.find(id => id === field.sourceFieldId));
  }, [fields, form]);

  const availableFields = useMemo(() => getAvailableFields(), [getAvailableFields]);

  const updateTemplate = useMemo(
    () => debounce(() => {
      const {
        values: {
          minisheet_config: {
            wizard: {
              title: titleField = {},
              tree: treeData = [],
            } = {},
          } = {},
        },
      } = form.getState();

      const template = createTemplate(titleField, treeData, fields, translate);

      form.change('minisheet_config.template', template);
    }, 200),
    [fields, form, translate],
  );


  if (geomType === undefined || !sourceId) {
    return (
      <Placeholder>
        <Typography variant="h5" component="h2">
          {translate('datalayer.form.minisheet.no-source')}
        </Typography>
      </Placeholder>
    );
  }

  return (
    <>
      <Condition when="minisheet_config.enable" is={v => !v}>
        <Placeholder>
          <div className={classes.placeholder}>
            <Typography variant="h5" component="h2" style={{ paddingBottom: '1em' }}>
              {translate('datalayer.form.minisheet.card-message')}
            </Typography>
            <BooleanInput
              source="minisheet_config.enable"
              label="datalayer.form.minisheet.enable"
            />
          </div>
        </Placeholder>
      </Condition>

      <Condition when="minisheet_config.enable" is>
        <BooleanInput source="minisheet_config.enable" label="datalayer.form.minisheet.disable" defaultValue={false} />
        <FieldGroup>
          <div className={classes.title}>
            <h3>{translate('datalayer.form.minisheet.title')}</h3>
            <BooleanInput
              source="minisheet_config.advanced"
              label="datalayer.form.minisheet.advanced"
              defaultValue={false}
            />
          </div>
          <InputLabel>{translate('datalayer.form.minisheet.color-label')}</InputLabel>
          <Field name="minisheet_config.highlight_color" defaultValue="#cccccc">
            {({ input: { onChange, value } }) => (
              <ColorPicker onChange={onChange} value={value} />
            )}
          </Field>
          <Condition when="minisheet_config.advanced" is={v => v}>
            <TextInput
              multiline
              source="minisheet_config.template"
              label="datalayer.form.minisheet.template"
              fullWidth
            />
            <TextInput
              label="datalayer.form.compare-url.title"
              source="settings.compare"
            />
            <HelpContent
              title="datalayer.form.compare-url.help-title"
              content="datalayer.form.compare-url.help-text"
            />
          </Condition>
          <Condition when="minisheet_config.advanced" is={v => !v}>
            {/* Keep value in react-admin form when changing tab */}
            <TextInput style={{ display: 'none' }} source="minisheet_config.template" />
            <MiniSheetFieldTree
              fields={availableFields}
              updateTemplate={updateTemplate}
            />
          </Condition>
        </FieldGroup>
      </Condition>
    </>
  );
};

export default MinisheetTab;
