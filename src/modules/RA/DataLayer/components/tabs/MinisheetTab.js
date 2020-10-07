import React from 'react';

import {
  TextInput,
  BooleanInput,
} from 'react-admin';

import { useField } from 'react-final-form';

import { ColorInput } from 'react-admin-color-input';
import { makeStyles } from '@material-ui/core/styles';

import HelpContent from '../../../../../components/react-admin/HelpContent';

const useStyles = makeStyles({
  colorPicker: {
    width: '25%',
  },
});


const MinisheetTab = () => {
  const classes = useStyles();
  const { input: { value: minisheetEnable } } = useField('minisheet_enable');

  return (
    <>
      <BooleanInput source="minisheet_enable" label="datalayer.form.minisheet.display-on-click" />

      <ColorInput source="highlight_color" label="datalayer.form.minisheet.pick-highlight-color" className={classes.colorPicker} />

      {minisheetEnable && (
        <>
          <TextInput multiline source="minisheet_template" label="datalayer.form.minisheet.template" fullWidth />
          <TextInput
            label="datalayer.form.compare-url.title"
            source="settings.compare"
          />
          <HelpContent title="datalayer.form.compare-url.help-title" content="datalayer.form.compare-url.help-text" />
        </>
      )}
    </>
  );
};

export default MinisheetTab;
