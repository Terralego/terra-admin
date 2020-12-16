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

import Condition from '../../../../../components/react-admin/Condition';


const LegendTab = () => {
  useField('settings.advanced_legend', { defaultValue: true });

  return (
    <>
      <BooleanInput source="settings.advanced_legend" label="datalayer.form.legend.advanced" style={{ float: 'right' }} />
      <Condition when="settings.advanced_legend" is>
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
      </Condition>
      <Condition when="settings.advanced_legend" is={false}>
        <Placeholder>
          <Typography variant="h5" component="h2">
            En construction
          </Typography>
        </Placeholder>
      </Condition>
    </>
  );
};


export default LegendTab;
