import React from 'react';

import {
  TextInput,
  BooleanInput,
  NumberInput,
} from 'react-admin';


import { useField } from 'react-final-form';

import FieldGroup from '../../../../../components/react-admin/FieldGroup';

const PopupTab = () => {
  const { input: { value: popupEnable } } = useField('popup_enable');

  return (
    <>
      <BooleanInput source="popup_enable" label="datalayer.form.popup.display-on-hover" />

      {popupEnable && (
        <FieldGroup>
          <NumberInput source="popup_minzoom" label="datalayer.form.popup.min-zoom" defaultValue={0} step={1} />
          <NumberInput source="popup_maxzoom" label="datalayer.form.popup.max-zoom" defaultValue={24} step={1} />
          <TextInput multiline source="popup_template" label="datalayer.form.popup.template" />
        </FieldGroup>
      )}
    </>
  );
};


export default PopupTab;
