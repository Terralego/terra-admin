import React from 'react';
import {
  Labeled,
  useInput,
} from 'react-admin';

import Typography from '@material-ui/core/Typography';

import { JsonEditor as Editor } from 'jsoneditor-react';
import 'jsoneditor-react/es/editor.min.css';

import ace from 'brace';
import 'brace/mode/json';
import 'brace/theme/github';


const sanitizeValue = (value, defaultValue) => (
  typeof value === 'object'
    ? value
    : defaultValue
);

const allowedModes = ['code', 'tree'];

export const JSONInput = props => {
  const {
    input: { value, ...rest },
    meta: { touched, error },
  } = useInput(props);

  const { source, initialValue = {} } = props;

  return (
    <Labeled label={source} {...props}>
      <>
        {(touched && error) && (
          <Typography color="error">{error}</Typography>
        )}
        <Editor
          value={sanitizeValue(value, initialValue)}
          ace={ace}
          theme="ace/theme/github"
          mode="code"
          allowedModes={allowedModes}
          navigationBar={false}
          search={false}
          {...rest}
        />
      </>
    </Labeled>
  );
};

export default JSONInput;
