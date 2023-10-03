import React from 'react';

import { BooleanInput, useTranslate } from 'react-admin';
import { useField } from 'react-final-form';

import Typography from '@material-ui/core/Typography';
import Placeholder from '../../../../../../components/Placeholder';

import EmbedConfigField from './EmbedConfigField';

const validateEmbedFields = data => {
  const valid = !data.some(({ label }) => label && !label.length);
  if (!valid) {
    return 'datalayer.form.embed.row-in-error';
  }
  return undefined;
};

const EmbedConfigTabContent = props => {
  const { input: { value: embedEnable, onChange: onEmbedEnableChange } } = useField('settings.embed_enable');
  const { input: { value: source } } = useField('source');
  const { input: { value: embedExportEnable } } = useField('embed_export_enable');
  const translate = useTranslate();

  if (!source) {
    return (
      <Placeholder>
        <Typography variant="h5" component="h2">
          {translate('datalayer.form.embed.no-source')}
        </Typography>
      </Placeholder>
    );
  }

  // No embed yet
  if (!embedEnable) {
    return (
      <Placeholder>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1em', alignItems: 'center' }}>
          <Typography variant="h5" component="h2">{translate('datalayer.form.embed.no-embed')}</Typography>
          <BooleanInput
            source="settings.embed_enable"
            label="datalayer.form.embed.allow"
            onChange={onEmbedEnableChange}
          />
        </div>
      </Placeholder>
    );
  }

  return (
    <>
      <BooleanInput
        source="settings.embed_enable"
        label="datalayer.form.embed.allow-display-data-embed"
        onChange={onEmbedEnableChange}
      />
      <EmbedConfigField
        source="fields"
        label="datalayer.form.embed.all-fields"
        exportEnabled={embedExportEnable}
        validate={validateEmbedFields}
        {...props}
      />
    </>
  );
};


export default EmbedConfigTabContent;
