import React from 'react';

import {
  TextInput,
  BooleanInput,
  useTranslate,
} from 'react-admin';

import { Field } from 'react-final-form';

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';

import Placeholder from '../../../../../../components/Placeholder';
import ColorPicker from '../../../../../../components/react-admin/ColorPicker';
import HelpContent from '../../../../../../components/react-admin/HelpContent';
import FieldGroup from '../../../../../../components/react-admin/FieldGroup';
import Condition from '../../../../../../components/react-admin/Condition';
import useSourceData from '../../useSourceData';
import MinisheetEditor from './MinisheetEditor';
import { MinisheetPreviewPublisher } from './useMinisheetPreview';

const useStyles = makeStyles({
  placeholder: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    width: '100%',
    borderBottom: 'thin solid grey',
    marginBottom: '25px',
  },
  section: {
    width: '100%',
    marginBottom: '25px',
  },
});


const MinisheetTab = () => {
  const classes = useStyles();
  const translate = useTranslate();
  const { geom_type: geomType, id: sourceId } = useSourceData('source');

  if (geomType === undefined || !sourceId) {
    return (
      <>
        <MinisheetPreviewPublisher />
        <Placeholder>
          <Typography variant="h5" component="h2">
            {translate('datalayer.form.minisheet.no-source')}
          </Typography>
        </Placeholder>
      </>
    );
  }

  return (
    <>
      <MinisheetPreviewPublisher />
      <Condition when="minisheet_config.enable" is={v => !v}>
        <Placeholder>
          <div className={classes.placeholder}>
            <Typography variant="h5" component="h2" style={{ paddingBottom: '1em' }}>
              {translate('datalayer.form.minisheet.card-message')}
            </Typography>
            <BooleanInput
              source="minisheet_config.enable"
              label="datalayer.form.minisheet.enable"
            />
          </div>
        </Placeholder>
      </Condition>

      <Condition when="minisheet_config.enable" is>
        <BooleanInput source="minisheet_config.enable" label="datalayer.form.minisheet.disable" defaultValue={false} />
        <FieldGroup>
          <div className={classes.title}>
            <h3>{translate('datalayer.form.minisheet.title')}</h3>
          </div>
          <div className={classes.section}>
            <InputLabel>{translate('datalayer.form.minisheet.color-label')}</InputLabel>
            <Field name="minisheet_config.highlight_color" defaultValue="#cccccc">
              {({ input: { onChange, value } }) => (
                <ColorPicker onChange={onChange} value={value} />
              )}
            </Field>
          </div>
          <div className={classes.section}>
            <MinisheetEditor />
          </div>
          <TextInput
            label="datalayer.form.compare-url.title"
            source="settings.compare"
          />
          <HelpContent
            title="datalayer.form.compare-url.help-title"
            content="datalayer.form.compare-url.help-text"
          />
        </FieldGroup>
      </Condition>
    </>
  );
};

export default MinisheetTab;
