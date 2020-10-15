
import React from 'react';

import { useField } from 'react-final-form';

import JSONInput from '../../../../../../components/react-admin/JSONInput';


const AdvancedStyleEditor = () => {
  const { input: { value, onchange } } = useField('settings.filter_config.wizard');

  return (
    <>
      <JSONInput
        source="settings.filter_config.wizard"
        label="datalayer.form.styles.wizard_style"
        fullWidth
      />
    </>
  );
};

export default AdvancedStyleEditor;
