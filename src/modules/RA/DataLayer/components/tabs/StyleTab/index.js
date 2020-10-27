import React from 'react';

import {
  FormTab,
  ArrayInput,
  SimpleFormIterator,
  useTranslate,
} from 'react-admin';

import { useField } from 'react-final-form';

import Typography from '@material-ui/core/Typography';

import CustomLayer from './CustomLayer';

import useSourceData from '../../useSourceData';

import Placeholder from '../../../../../../components/Placeholder';

import StyleEditor from './StyleEditor';


const StyleTab = ({ external }) => {
  const translate = useTranslate();
  const [extraStylesInitialValue] = React.useState([]);
  const { geom_type: geomType } = useSourceData('source');
  const { input: { value: mainStyle } } = useField('settings.main_style');
  const { input: { value: extraStyles } } = useField('settings.extra_styles', { initialValue: extraStylesInitialValue });

  if (geomType === undefined) {
    return (
      <Placeholder>
        <Typography variant="h5" component="h2">
          {translate('datalayer.form.styles.no-source')}
        </Typography>
      </Placeholder>
    );
  }

  return (
    <FormTab disabled={external} label="datalayer.form.styles.tab" path="style">
      <StyleEditor path="settings.main_style" geomType={geomType} />

      <ArrayInput source="settings.extra_styles" label="datalayer.form.styles.secondarylabels" fullWidth>
        <SimpleFormIterator>
          <CustomLayer />
        </SimpleFormIterator>
      </ArrayInput>
      <>
        <div style={{ paddingTop: '5em', color: '#ccc' }}>
          <pre>{JSON.stringify(mainStyle, null, 2)}</pre>
        </div>
        <div style={{ paddingTop: '5em', color: '#ccc' }}>
          <pre>{JSON.stringify(extraStyles, null, 2)}</pre>
        </div>
      </>
    </FormTab>
  );
};

export default StyleTab;
