import React from 'react';

import {
  FormTab,
  ArrayInput,
  SimpleFormIterator,
  useTranslate,
  useDataProvider,
} from 'react-admin';

import { useField, useForm } from 'react-final-form';

import Typography from '@material-ui/core/Typography';


import CustomLayer from './CustomLayer';

import useSourceData from '../../useSourceData';

import Placeholder from '../../../../../../components/Placeholder';

import StyleEditor from './StyleEditor';


import { usePrevious } from '../../../../../../utils/hooks';
import { RES_DATASOURCE } from '../../../../ra-modules';

const StyleTab = ({ external, ...rest }) => {
  const translate = useTranslate();
  const [extraStylesInitialValue] = React.useState([]);
  const form = useForm();

  const dataProvider = useDataProvider();

  const { geom_type: geomType, id: sourceId } = useSourceData('source');

  const {
    input: { value: fields },
  } = useField('fields');
  const { input: { value: mainStyle } } = useField('main_style');
  const { input: { value: extraStyles } } = useField('extra_styles', { defaultValue: extraStylesInitialValue });

  const getValuesOfProperty = React.useCallback(property =>
    dataProvider('PROPERTY_VALUES', RES_DATASOURCE, { id: sourceId, property }),
  [dataProvider, sourceId]);

  if (geomType === undefined || !sourceId) {
    return (
      <Placeholder>
        <Typography variant="h5" component="h2">
          {translate('datalayer.form.styles.no-source')}
        </Typography>
      </Placeholder>
    );
  }


  /* React.useEffect(() => {
    const getValueList = async () => {
      if (!dataSource.id || (dataSource.id === prevSourceId && field === prevField)) return;

      const result = await dataProvider('PROPERTY_VALUES', RES_DATASOURCE, { id: dataSource.id, property: field });
      console.log('result', result);
      setValueList(result.map(val => ({ name: val, color: randomColor() })));
    };
    getValueList();
  }, [dataProvider, dataSource.id, field, prevField, prevSourceId, setValueList]); */


  // Handle intermediate state of data loading and
  // Different use cases: new record, existing record from menu
  // existing record after reloading the page
  if (rest.record.id && !mainStyle) {
    return null;
  }

  return (
    <FormTab disabled={external} label="datalayer.form.styles.tab" path="style" {...rest}>
      <StyleEditor path="main_style" geomType={geomType} fields={fields} getValuesOfProperty={getValuesOfProperty} />

      <ArrayInput source="extra_styles" label="datalayer.form.styles.secondarylabels" fullWidth>
        <SimpleFormIterator>
          <CustomLayer fields={fields} />
        </SimpleFormIterator>
      </ArrayInput>
      <> {/* Protect div from RA props */}
        <div style={{ paddingTop: '5em', color: '#ccc', fontSize: '0.7em', display: 'flex' }}>
          <pre>{JSON.stringify(mainStyle, null, 2)}</pre>
          <pre>{JSON.stringify(extraStyles, null, 2)}</pre>
        </div>
      </>
    </FormTab>
  );
};

export default StyleTab;
