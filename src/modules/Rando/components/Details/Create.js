import React from 'react';
import { withRouter } from 'react-router';
import { withNamespaces } from 'react-i18next';
import Form from 'react-jsonschema-form';
import { Button } from '@blueprintjs/core';

import { connectRandoProvider } from '../../services/RandoProvider';

const MOCK_GEOM = { geom: { type: 'LineString', coordinates: [[0.5317265, 43.9421408], [0.5316611, 43.9420908]] } };
class Create extends React.Component {
  state = {
    loading: false,
  }

  submitFeature = async formData => {
    const { schema, history: { push } } = this.props;
    const {
      match: { params: { layer } },
      saveFeature,
    } = this.props;

    const formHasChanged = Object.keys(formData).some(prop => (
      formData[prop] !== schema.properties[prop].default
    ));

    if (!formHasChanged) {
      return;
    }

    this.setState({
      loading: true,
    });

    const savedFeature = await saveFeature(
      layer,
      false,
      { ...MOCK_GEOM, properties: formData },
    );

    if (savedFeature !== null) {
      push(`/rando/map/layer/${layer}/update/${savedFeature.identifier}`);
      return;
    }

    this.setState({
      loading: false,
    });
  }

  render () {
    const { loading } = this.state;
    const { t, schema, schema: { properties } } = this.props;
    if (!properties) return null;
    return (
      <div className="details ">
        <div className="details__header">
          <h2 className="details__title">{t('rando.details.create')}</h2>
        </div>
        <div className="details_content">
          <Form
            schema={schema}
            onSubmit={({ formData }) => this.submitFeature(formData)}
          >
            <Button intent="primary" loading={loading} type="submit"> {t('rando.details.create')}</Button>
          </Form>
        </div>
      </div>
    );
  }
}

export default connectRandoProvider('saveFeature')(withRouter(withNamespaces()(Create)));
