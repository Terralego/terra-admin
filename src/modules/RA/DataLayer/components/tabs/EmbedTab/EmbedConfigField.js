import React from 'react';
import {
  useTranslate,
  useInput,
  ArrayInput,
  SimpleFormIterator,
} from 'react-admin';
import Typography from '@material-ui/core/Typography';

import EmbedItemInput from './EmbedItemInput';

const EmbedConfigField = ({ label, ...rest }) => {
  const translate = useTranslate();
  const {
    meta: { error },
  } = useInput(rest);

  return (
    <>
      <Typography variant="h5" component="h2">{translate(label)}</Typography>

      {error && error.length > 0 && error.flatMap(err =>
        err && Object.entries(err).map(([key, value]) => (
          <Typography color="error">{key}: {translate(value)}</Typography>)))}

      <ArrayInput source="settings.embed" label="">
        <SimpleFormIterator>
          <EmbedItemInput />
        </SimpleFormIterator>
      </ArrayInput>
    </>
  );
};

export default EmbedConfigField;
