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

const sanitizeObject = val => {
  // To handle bad string values when unmounting component
  if (typeof (val) !== 'object') {
    return null;
  }
  return val;
};

export const JSONInput = addField(
  ({
    meta,
    source,
    defaultValue = {},
    input: { value = defaultValue || {}, onChange },
    ...props
  }) => (
    <Labeled label={source} {...props}>
      <>
        <Editor
          value={sanitizeObject(value)}
          ace={ace}
          theme="ace/theme/github"
          mode="code"
          allowedModes={['code', 'tree']}
          navigationBar={false}
          search={false}
          onChange={onChange}
          {...sanitizeRestProps(props)}
        />
        {meta.error && <p className="error">{meta.error}</p>}
      </>
    </Labeled>
  ),
);

export default JSONInput;
