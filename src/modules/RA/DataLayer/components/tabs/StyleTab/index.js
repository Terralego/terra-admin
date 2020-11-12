import React from 'react';

import {
  FormTab,
  ArrayInput,
  SimpleFormIterator,
  useTranslate,
} from 'react-admin';

import { useField, useForm } from 'react-final-form';

import Typography from '@material-ui/core/Typography';


import CustomLayer from './CustomLayer';

import useSourceData from '../../useSourceData';

import Placeholder from '../../../../../../components/Placeholder';

import StyleEditor from './StyleEditor';


const StyleTab = ({ external, ...rest }) => {
  const translate = useTranslate();
  const [extraStylesInitialValue] = React.useState([]);
  const form = useForm();

  const { geom_type: geomType } = useSourceData('source');
  const { input: { value: mainStyle } } = useField('main_style');
  const { input: { value: extraStyles } } = useField('extra_styles', { defaultValue: extraStylesInitialValue });

  if (geomType === undefined) {
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
    <FormTab disabled={external} label="datalayer.form.styles.tab" path="style" {...rest}>
      <StyleEditor path="main_style" geomType={geomType} />

      <ArrayInput source="extra_styles" label="datalayer.form.styles.secondarylabels" fullWidth>
        <SimpleFormIterator>
          <CustomLayer />
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
