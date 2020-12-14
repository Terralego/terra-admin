import React, { useEffect, useCallback, useMemo } from 'react';
import { useField, useForm, Field } from 'react-final-form';
import {
  TextInput,
  BooleanInput,
  useTranslate,
} from 'react-admin';
import debounce from 'lodash.debounce';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import { makeStyles } from '@material-ui/core';

import FieldGroup from '../../../../../../components/react-admin/FieldGroup';
import AddPopupField from './AddPopupField';
import PopupFieldList from './PopupFieldList';
import createTemplate from './popupTemplate';

const useStyle = makeStyles({
  popupEnabler: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '40vh',
  },
  card: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    borderBottom: 'thin solid grey',
    marginBottom: '25px',
  },
});


const PopupTab = () => {
  const translate = useTranslate();
  const form = useForm();
  const classes = useStyle();

  const { input: { value: fields } } = useField('fields');
  const { input: { value: mainFieldId } } = useField('main_field');
  const { input: { value: enable = false } } = useField('popup_config.enable');
  const { input: { value: advanced = false } } = useField('popup_config.advanced');
  const { input: { value: { fields: popupfields = [] } = {} } } = useField('popup_config.wizard', {
    initialValue: useMemo(() => ({ fields: [{ sourceFieldId: mainFieldId }] }), [mainFieldId]),
  });

  const updateTemplate = useCallback(debounce(() => {
    if (popupfields.length > 0) {
      const lines = createTemplate(popupfields, fields);

      form.change('popup_config', {
        ...form.getState().values.popup_config,
        template: lines.join('\n'),
      });
    }
  }, 200), [form, popupfields, fields]);

  useEffect(() => {
    if (advanced !== true) {
      updateTemplate();
    }
  }, [popupfields, advanced, updateTemplate]);

  return (
    <>
      {enable && (
        <FieldGroup>
          <BooleanInput source="popup_config.enable" label="datalayer.form.popup.enable" />
          <div className={classes.title}>
            <h3>{translate('datalayer.form.popup.title')}</h3>
            <BooleanInput source="popup_config.advanced" label="datalayer.form.popup.advanced" />
          </div>
          <div>
            <Typography id="discrete-slider" gutterBottom>
              {translate('datalayer.form.popup.min-zoom')}
            </Typography>
            <Field name="popup_config.minzoom" defaultValue={0}>
              {({ input: { value, onChange } }) => (
                <Slider
                  onChange={(e, newValue) => onChange(newValue)}
                  value={value}
                  min={0}
                  max={24}
                  step={1}
                  marks
                  aria-labelledby="discrete-slider"
                  valueLabelDisplay="auto"
                />
              )}
            </Field>
          </div>
          <div>
            <Typography id="discrete-slider" gutterBottom>
              {translate('datalayer.form.popup.max-zoom')}
            </Typography>
            <Field name="popup_config.maxzoom" defaultValue={24}>
              {({ input: { value, onChange } }) => (
                <Slider
                  onChange={(e, newValue) => onChange(newValue)}
                  value={value}
                  min={0}
                  max={24}
                  step={1}
                  marks
                  aria-labelledby="discrete-slider"
                  valueLabelDisplay="auto"
                />
              )}
            </Field>
          </div>
          {advanced && (
            <TextInput
              multiline
              source="popup_config.template"
              label="datalayer.form.popup.template"
            />
          )}
          {!advanced && (
            <>
              <PopupFieldList
                fields={fields}
                popupFields={popupfields}
              />
              <AddPopupField
                fields={fields}
                popupFields={popupfields}
              />
            </>
          )}
        </FieldGroup>
      )}
      {!enable && (
        <div className={classes.popupEnabler}>
          <Card className={classes.card}>
            <CardContent>
              <Typography variant="h6">
                {translate('datalayer.form.popup.card-message')}
              </Typography>
            </CardContent>
            <BooleanInput
              source="popup_config.enable"
              label="datalayer.form.popup.enable"
            />
          </Card>
        </div>
      )}
    </>
  );
};


export default PopupTab;
