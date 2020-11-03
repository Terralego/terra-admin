import React, { useEffect, useCallback } from 'react';
import { useField, useForm } from 'react-final-form';
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

const useStyle = makeStyles({
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
  const { input: { value: fields } } = useField('fields');
  const {
    input: {
      value: {
        wizard: { fields: popupfields = [] } = {},
        minzoom = 0,
        maxzoom = 24,
        advanced,
      },
    },
  } = useField('popup_config');

  const translate = useTranslate();
  const form = useForm();
  const classes = useStyle();


  const updateTemplate = useCallback(debounce(() => {
    if (popupfields.length) {
      const lines = popupfields.map(({
        suffix,
        prefix,
        field: { name },
        default: defaultTitle,
      }) => (
        `${prefix}: {% if ${name}.length > 0} %}{{${name}}} ${suffix}{% else %}${defaultTitle}{% endif %}`
      ));
      form.change('popup_config', {
        ...form.getState().values.popup_config,
        template: lines.join('\n'),
        enabled: true,
      });
    }
  }, 2000), [form, popupfields]);
  useEffect(updateTemplate, [updateTemplate]);


  const onMinZoomChange = (e, newValue) =>
    form.change('popup_config', { ...form.getState().values.popup_config, minzoom: newValue });

  const onMaxZoomChange = (e, newValue) =>
    form.change('popup_config', { ...form.getState().values.popup_config, maxzoom: newValue });

  return (
    <>
      {popupfields.length > 0 && (
        <FieldGroup>
          <div className={classes.title}>
            <h3>{translate('datalayer.form.popup.title')}</h3>
            <BooleanInput source="popup_config.advanced" label="datalayer.form.popup.advanced" />
          </div>
          <Typography id="discrete-slider" gutterBottom>
            {translate('datalayer.form.popup.min-zoom')}
          </Typography>
          <Slider
            onChange={onMinZoomChange}
            value={minzoom}
            min={0}
            max={24}
            step={1}
            marks
            aria-labelledby="discrete-slider"
            valueLabelDisplay="auto"
          />
          <Typography id="discrete-slider" gutterBottom>
            {translate('datalayer.form.popup.max-zoom')}
          </Typography>
          <Slider
            onChange={onMaxZoomChange}
            value={maxzoom}
            min={0}
            max={24}
            step={1}
            marks
            aria-labelledby="discrete-slider"
            valueLabelDisplay="auto"
          />
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
              <AddPopupField fields={fields} />
            </>
          )}
        </FieldGroup>
      )}
      {!popupfields.length && (
        <div className={classes.addPopup}>
          <Card className={classes.card}>
            <CardContent>
              <Typography variant="h6">
                {translate('datalayer.form.popup.card-message')}
              </Typography>
            </CardContent>
            <AddPopupField fields={fields} />
          </Card>
        </div>
      )}
    </>
  );
};


export default PopupTab;
