import React from 'react';

import {
  TextInput,
  BooleanInput,
  ArrayInput,
  SimpleFormIterator,
} from 'react-admin';

import LegendItemsField from '../LegendItemsField';

import HelpContent from '../../../../../components/react-admin/HelpContent';


const LegendTab = () => (
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
);


export default LegendTab;
