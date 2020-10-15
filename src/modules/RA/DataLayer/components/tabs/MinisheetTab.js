import React from 'react';

import {
  TextInput,
  BooleanInput,
} from 'react-admin';

import { useField } from 'react-final-form';

import { ColorInput } from 'react-admin-color-input';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import HelpContent from '../../../../../components/react-admin/HelpContent';
import Placeholder from '../../../../../components/Placeholder';

const useStyles = makeStyles({
  colorPicker: {
    width: '25%',
  },
});


const MinisheetTab = () => {
  const classes = useStyles();
  const { input: { value: minisheetEnable } } = useField('minisheet_enable');
  const { input: { value: advancedMinisheet } } = useField('settings.advanced_minisheet');

  return (
    <>
      <BooleanInput source="settings.advanced_minisheet" label="datalayer.form.minisheet.advanced" style={{ float: 'right' }} />
      <BooleanInput source="minisheet_enable" label="datalayer.form.minisheet.display-on-click" />

      <ColorInput source="highlight_color" label="datalayer.form.minisheet.pick-highlight-color" className={classes.colorPicker} />

      {(minisheetEnable && advancedMinisheet) && (
        <>
          <TextInput multiline source="minisheet_template" label="datalayer.form.minisheet.template" fullWidth />
          <TextInput
            label="datalayer.form.compare-url.title"
            source="settings.compare"
          />
          <HelpContent title="datalayer.form.compare-url.help-title" content="datalayer.form.compare-url.help-text" />
        </>
      )}
      {(minisheetEnable && !advancedMinisheet) && (
        <Placeholder>
          <Typography variant="h5" component="h2">
            In construction
          </Typography>
        </Placeholder>
      )}
    </>
  );
};

export default MinisheetTab;
