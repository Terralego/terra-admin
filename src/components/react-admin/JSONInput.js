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

const defaultInitialValue = {};

export const JSONInput = ({ source, initialValue = defaultInitialValue, ...propRest }) => {
  const editorRef = React.useRef(null);
  const {
    input: { value, ...rest },
    meta: { touched, error },
  } = useInput({ source, initialValue });

  React.useEffect(() => {
    editorRef.current.jsonEditor.update(value || initialValue);
  }, [initialValue, value]);


  return (
    <Labeled label={source} {...propRest}>
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
          ref={editorRef}
          {...rest}
        />
      </>
    </Labeled>
  );
};

export default JSONInput;
