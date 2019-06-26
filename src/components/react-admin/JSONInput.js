import React from 'react';
import {
  FormDataConsumer,
  REDUX_FORM_NAME,
  withDataProvider,
  Labeled,
} from 'react-admin';

import { JsonEditor as Editor } from 'jsoneditor-react';
import 'jsoneditor-react/es/editor.min.css';

import ace from 'brace';
import 'brace/mode/json';
import 'brace/theme/github';

// eslint-disable-next-line import/no-extraneous-dependencies
import { change } from 'redux-form';

const sanitizeObject = data => {
  if (typeof data === 'string') {
    try {
      return JSON.parse(data);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  }

  return data;
};

const sanitizeRestProps = ({
  basePath, i18n, i18nOptions, id, index,
  lng, resource, source, tReady, ...rest
}) => rest;

export const JSONInput = withDataProvider(({ dispatch, dataProvider, source, ...props }) => (
  <Labeled {...props}>
    <FormDataConsumer>
      {({ defaultValue = {}, formData: { [source]: data = defaultValue } = {} }) => (
        <Editor
          value={sanitizeObject(data)}
          ace={ace}
          theme="ace/theme/github"
          mode="code"
          allowedModes={['code', 'tree', 'view']}
          navigationBar={false}
          search={false}
          name={source}
          onChange={newData =>
            dispatch(change(REDUX_FORM_NAME, source, newData, null, 2))}
          {...sanitizeRestProps(props)}
        />
      )}
    </FormDataConsumer>
  </Labeled>
));

export default JSONInput;
