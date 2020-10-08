import React from 'react';

import {
  TextInput,
  BooleanInput,
  NumberInput,
} from 'react-admin';


import { useField } from 'react-final-form';
import Typography from '@material-ui/core/Typography';

import FieldGroup from '../../../../../components/react-admin/FieldGroup';
import Placeholder from '../../../../../components/Placeholder';

const PopupTab = () => {
  const { input: { value: popupEnable } } = useField('popup_enable');
  const { input: { value: advancedPopup } } = useField('settings.advanced_popup');

  return (
    <>
      <BooleanInput source="popup_enable" label="datalayer.form.popup.display-on-hover" />
      <BooleanInput source="settings.advanced_popup" label="datalayer.form.popup.advanced" />

      {(popupEnable && advancedPopup) && (
        <FieldGroup>
          <NumberInput source="popup_minzoom" label="datalayer.form.popup.min-zoom" defaultValue={0} step={1} />
          <NumberInput source="popup_maxzoom" label="datalayer.form.popup.max-zoom" defaultValue={24} step={1} />
          <TextInput multiline source="popup_template" label="datalayer.form.popup.template" />
        </FieldGroup>
      )}

      {(popupEnable && !advancedPopup) && (
        <Placeholder>
          <Typography variant="h5" component="h2">
            In construction
          </Typography>
        </Placeholder>
      )}
    </>
  );
};


export default PopupTab;
