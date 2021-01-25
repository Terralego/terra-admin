import React, { useEffect, useCallback, useMemo } from 'react';
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
import ZoomInput from '../../../../BaseLayer/components/ZoomInput';
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
  const { input: { value: mainFieldId } } = useField('main_field');
  const { input: { value: enable = false } } = useField('popup_config.enable');
  const { input: { value: advanced } } = useField('popup_config.advanced', { initialValue: true });
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
      {enable && (
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
      )}
    </>
  );
};


export default PopupTab;
