import React from 'react';

import {
  TextInput,
  BooleanInput,
  useTranslate,
} from 'react-admin';

import { useField } from 'react-final-form';

import { ColorInput } from 'react-admin-color-input';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import MiniSheetFieldTree from './MiniSheetFieldTree';

import HelpContent from '../../../../../../components/react-admin/HelpContent';
import FieldGroup from '../../../../../../components/react-admin/FieldGroup';

const useStyles = makeStyles({
  colorPicker: {
    width: '25%',
  },
  addPopup: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '40vh',
  },
  card: {
    display: 'flex',
    flexDirection: 'row',
  },
});


const MinisheetTab = () => {
  const classes = useStyles();
  const translate = useTranslate();
  const { input: { value: fields } } = useField('fields');
  const {
    input: {
      value: {
        advanced,
        enable,
        wizard: { sections = [], title = {} } = {},
      },
    },
  } = useField('minisheet_config');

  return (
    <>
      {!enable && (
        <div className={classes.addPopup}>
          <Card className={classes.card}>
            <CardContent>
              <Typography variant="h6">
                {translate('datalayer.form.popup.card-message')}
              </Typography>
            </CardContent>
            <BooleanInput source="minisheet_config.enable" label="datalayer.form.minisheet.enable" />
          </Card>
        </div>
      )}
      {enable && (
        <>
          <BooleanInput source="minisheet_config.enable" label="datalayer.form.minisheet.enable" />
          <FieldGroup>
            <BooleanInput source="minisheet_config.advanced" label="datalayer.form.minisheet.advanced" />
            <ColorInput source="highlight_color" label="datalayer.form.minisheet.pick-highlight-color" className={classes.colorPicker} />

            {advanced && (
            <>
              <TextInput multiline source="minisheet_template" label="datalayer.form.minisheet.template" fullWidth />
              <TextInput
                label="datalayer.form.compare-url.title"
                source="settings.compare"
              />
              <HelpContent title="datalayer.form.compare-url.help-title" content="datalayer.form.compare-url.help-text" />
            </>
            )}
            {!advanced && (
            <>
              <MiniSheetFieldTree sections={sections} fields={fields} titleField={title} />
            </>
            )}
          </FieldGroup>
        </>
      )}
    </>
  );
};

export default MinisheetTab;
