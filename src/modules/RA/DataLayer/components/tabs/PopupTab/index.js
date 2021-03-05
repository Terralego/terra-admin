import React, { useCallback } from 'react';
import { useField, useForm } from 'react-final-form';
import {
  TextInput,
  BooleanInput,
  useTranslate,
} from 'react-admin';
import debounce from 'lodash.debounce';

import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core';
import ZoomOut from '@material-ui/icons/ZoomOut';
import ZoomIn from '@material-ui/icons/ZoomIn';

import FieldGroup from '../../../../../../components/react-admin/FieldGroup';
import Placeholder from '../../../../../../components/Placeholder';
import ZoomInput from '../../../../../../components/react-admin/ZoomInput';
import Condition from '../../../../../../components/react-admin/Condition';
import useSourceData from '../../useSourceData';
import AddPopupField from './AddPopupField';
import PopupFieldList from './PopupFieldList';
import createTemplate from './popupTemplate';

const useStyle = makeStyles({
  title: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    borderBottom: 'thin solid grey',
    marginBottom: '25px',
  },
  placeholder: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
  },
});

const PopupTab = () => {
  const translate = useTranslate();
  const form = useForm();
  const classes = useStyle();
  const { geom_type: geomType, id: sourceId } = useSourceData('source');

  const { input: { value: fields } } = useField('fields');

  const updateTemplate = useCallback(debounce(() => {
    const {
      values: {
        popup_config: {
          wizard: {
            fields: popupfields = [],
          } = {},
        },
        popup_config: popupConfig,
      },
    } = form.getState();
    if (popupfields.length > 0) {
      const lines = createTemplate(popupfields, fields);

      form.change('popup_config', {
        ...popupConfig,
        template: lines.join('\n'),
      });
    }
  }, 200), [form, fields]);


  if (geomType === undefined || !sourceId) {
    return (
      <Placeholder>
        <Typography variant="h5" component="h2">
          {translate('datalayer.form.popup.no-source')}
        </Typography>
      </Placeholder>
    );
  }

  return (
    <>
      <Condition when="popup_config.enable" is={v => v}>
        <FieldGroup>
          <BooleanInput source="popup_config.enable" label="datalayer.form.popup.disable" />
          <div className={classes.title}>
            <h3>{translate('datalayer.form.popup.title')}</h3>
            <BooleanInput source="popup_config.advanced" label="datalayer.form.popup.advanced" />
          </div>
          <Typography id="discrete-slider" gutterBottom>
            {translate('datalayer.form.popup.zoom')}
          </Typography>
          <ZoomInput
            aria-labelledby="zoom-slider"
            min={0}
            max={24}
            nextElement={ZoomIn}
            prevElement={ZoomOut}
            initialValue={[0, 20]}
            fieldPaths={['popup_config.minzoom', 'popup_config.maxzoom']}
          />
          <Condition when="popup_config.advanced" is={v => v}>

            <TextInput
              multiline
              source="popup_config.template"
              label="datalayer.form.popup.template"
            />
          </Condition>

          <Condition when="popup_config.advanced" is={v => !v}>
            <PopupFieldList
              fields={fields}
              updateTemplate={updateTemplate}
            />
            <AddPopupField
              fields={fields}
            />
          </Condition>
        </FieldGroup>
      </Condition>

      <Condition when="popup_config.enable" is={v => !v}>
        <Placeholder>
          <div className={classes.placeholder}>
            <Typography variant="h5" component="h2" style={{ paddingBottom: '1em' }}>
              {translate('datalayer.form.popup.card-message')}
            </Typography>
            <BooleanInput
              source="popup_config.enable"
              label="datalayer.form.popup.enable"
            />
          </div>
        </Placeholder>
      </Condition>
    </>
  );
};


export default PopupTab;
