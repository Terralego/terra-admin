import React from 'react';
import {
  Labeled,
  addField,
} from 'react-admin';

import { JsonEditor as Editor } from 'jsoneditor-react';
import 'jsoneditor-react/es/editor.min.css';

import ace from 'brace';
import 'brace/mode/json';
import 'brace/theme/github';

const sanitizeRestProps = ({
  basePath, i18n, i18nOptions, id, index,
  lng, resource, source, tReady, ...rest
}) => rest;


export const JSONInput = addField(({ input, meta, source, defaultValue, ...props }) => {
  // eslint-disable-next-line prefer-const
  let value = input.value || defaultValue || {}; // TODO not working with empty string ...

  const handleChange = newValue => {
    // TODO We may add a debounce here to speed up process
    meta.touched = true;
    return input.onChange(newValue);
  };

  return (
    <Labeled label={source} {...props}>
      <>
        <pre style={{ display: 'none' }}>debug input.value: {JSON.stringify(input.value, null, 2)}</pre>
        <Editor
          value={value}
          ace={ace}
          theme="ace/theme/github"
          mode="code"
          allowedModes={['code', 'tree']}
          navigationBar={false}
          search={false}
          onChange={val => handleChange(val)}
          {...sanitizeRestProps(props)}
        />
        {meta.touched && meta.error && <p className="error">{meta.error}</p>}
      </>
    </Labeled>
  );
});


export default JSONInput;
