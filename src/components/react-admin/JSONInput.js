import React from 'react';
import {
  Labeled,
  useInput,
} from 'react-admin';

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
    meta: { error },
  } = useInput(props);

  const { source, initialValue = {} } = props;

  return (
    <Labeled label={source} {...props}>
      <>
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
        {error && <p className="error">{error}</p>}
      </>
    </Labeled>
  );
};

export default JSONInput;
