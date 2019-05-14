import React from 'react';

// eslint-disable-next-line import/no-extraneous-dependencies
import FormInput from 'ra-ui-materialui/lib/form/FormInput';

const FieldGroup = ({ children, ...props }) =>
  React.Children.map(children, input => (
    <FormInput input={input} {...props} />
  ));

export default FieldGroup;
