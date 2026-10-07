import React from 'react';
import { FormSpy } from 'react-final-form';
import { FormTab } from 'react-admin';

import ErrorIcon from '@material-ui/icons/Report';

const CustomFormTab = ({ children, onChange, inError, ...rest }) => {
  const icon = inError
    ? <ErrorIcon fontSize="small" style={{ color: 'red' }} />
    : null;

  return (
    <FormTab
      {...rest}
      icon={icon}
    >
      <FormSpy
        subscription={{
          errors: {},
          values: {},
          touched: {},
        }}
        onChange={onChange}
      />
      {children}
    </FormTab>

  );
};
export default CustomFormTab;
