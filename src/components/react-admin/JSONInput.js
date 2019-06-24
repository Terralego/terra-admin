import React from 'react';
import {
  LongTextInput,
  FormDataConsumer,
  REDUX_FORM_NAME,
  withDataProvider,
} from 'react-admin';

/* eslint-disable import/no-extraneous-dependencies */
import { change } from 'redux-form';
import Button from '@material-ui/core/Button';
/* eslint-enable */

export const validate = value => {
  try {
    JSON.parse(value);
  } catch (err) {
    return `Invalid JSON: \n${err}`;
  }
  return undefined;
};

const securedPrettyJSON = input => {
  try {
    return JSON.stringify(JSON.parse(input), null, 2);
  } catch (err) {
    return input;
  }
};

export const JSONInput = withDataProvider(({ dispatch, dataProvider, source, ...props }) => (
  <>
    <LongTextInput
      {...props}
      source={source}
      validate={validate}
    />
    <br />
    <FormDataConsumer>
      {({ formData: { [source]: data } }) => (
        <Button
          variant="outlined"
          size="small"
          color="primary"
          disabled={!!validate(data)}
          onClick={() => dispatch(change(REDUX_FORM_NAME, source, securedPrettyJSON(data) || null))}
        >
          Beautify
        </Button>
      )}
    </FormDataConsumer>
  </>
));

export default JSONInput;
