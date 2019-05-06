import React from 'react';
import { withRouter } from 'react-router';
import { withNamespaces } from 'react-i18next';
import Form from 'react-jsonschema-form';
import { Button } from '@blueprintjs/core';

import { connectRandoProvider } from '../../services/RandoProvider';

const Update = ({
  t,
  schema,
  schema: { properties },
  match: { params: { layer, id } },
  currentFeature: { geom },
  saveFeatureAction,
}) => {
  if (!properties) return null;
  const { name: { default: title } } = properties;
  return (
    <div className="details ">
      <div className="details__header">
        <h2 className="details__title">{title || t('rando.details.noFeature')}</h2>
      </div>
      <div className="details_content">
        <Form
          schema={schema}
          onSubmit={({ formData }) => saveFeatureAction(layer, id, { geom, properties: formData })}
        >
          <Button intent="primary" type="submit"> {t('rando.details.save')}</Button>
        </Form>
      </div>
    </div>
  );
};

export default connectRandoProvider('currentFeature', 'saveFeatureAction')(withRouter(withNamespaces()(Update)));
