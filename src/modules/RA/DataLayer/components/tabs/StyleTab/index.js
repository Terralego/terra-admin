import React from 'react';

import {
  ArrayInput,
  SimpleFormIterator,
  useTranslate,
  useDataProvider,
} from 'react-admin';

import { useField } from 'react-final-form';
import Typography from '@material-ui/core/Typography';

import useSourceData from '../../useSourceData';
import Placeholder from '../../../../../../components/Placeholder';
import { RES_DATASOURCE } from '../../../../ra-modules';

import CustomLayer from './CustomLayer';
import StyleEditor from './StyleEditor';

const StyleTab = ({ external, ...rest }) => {
  const translate = useTranslate();

  const dataProvider = useDataProvider();

  const { geom_type: geomType, id: sourceId } = useSourceData('source');

  const {
    input: { value: fields },
  } = useField('fields');

  const { input: { value: mainStyle } } = useField('main_style');

  const getValuesOfProperty = React.useCallback(property =>
    dataProvider('PROPERTY_VALUES', RES_DATASOURCE, { id: sourceId, property }).then(result => {
      result.sort((name1, name2) => `${name1}`.localeCompare(`${name2}`));
      return result;
    }),
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

  // Handle intermediate state of data loading and
  // Different use cases: new record, existing record from menu
  // existing record after reloading the page
  if (rest.record.id && !mainStyle) {
    return null;
  }

  return (
    <> {/* Protect div element */}
      <div>
        <StyleEditor path="main_style" geomType={geomType} fields={fields} getValuesOfProperty={getValuesOfProperty} />

        <ArrayInput source="extra_styles" label="datalayer.form.styles.secondarylabels" fullWidth>
          <SimpleFormIterator>
            <CustomLayer />
          </SimpleFormIterator>
        </ArrayInput>
      </div>
    </>
  );
};

export default StyleTab;
