import React from 'react';

import {
  TextInput,
  BooleanInput,
  ArrayInput,
  SimpleFormIterator,
} from 'react-admin';

import { useField } from 'react-final-form';
import Typography from '@material-ui/core/Typography';

import LegendItemsField from '../LegendItemsField';

import HelpContent from '../../../../../components/react-admin/HelpContent';
import Placeholder from '../../../../../components/Placeholder';


const LegendTab = () => {
  const { input: { value: advancedStyle } } = useField('settings.advanced_legend');

  return (
    <>
      <BooleanInput source="settings.advanced_legend" label="datalayer.form.legend.advanced" style={{ float: 'right' }} />
      {advancedStyle && (
        <ArrayInput source="legends" label="datalayer.form.legend.legends" fullWidth>
          <SimpleFormIterator>
            <TextInput multiline source="title" label="datalayer.form.legend.title" />
            <TextInput multiline source="content" label="datalayer.form.legend.template" />
            <LegendItemsField
              source="items"
              label="datalayer.form.legend.items"
              withSource="source"
              fullWidth
            />
            <HelpContent title="datalayer.form.legend.help.title" content="datalayer.form.legend.help.text" />
            <BooleanInput source="stackedCircles" label="datalayer.form.legend.stackedCircles" />
          </SimpleFormIterator>
        </ArrayInput>
      )}
      {!advancedStyle && (
        <Placeholder>
          <Typography variant="h5" component="h2">
            In construction
          </Typography>
        </Placeholder>
      )}
    </>
  );
};


export default LegendTab;
