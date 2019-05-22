import React from 'react';
import { withRouter } from 'react-router';
import { withNamespaces } from 'react-i18next';
import Form from 'react-jsonschema-form';
import { Button } from '@blueprintjs/core';

import { connectRandoProvider } from '../../services/RandoProvider';

class Update extends React.Component {
  state = {
    loading: false,
    schema: {},
  }

  componentDidMount () {
    const { schema } = this.props;
    this.setState({
      schema,
    });
  }

  static getDerivedStateFromProps ({ schema }, { schema: stateSchema }) {
    if (stateSchema !== schema) {
      return {
        schema,
      };
    }
    return null;
  }


  submitFeature = async formData => {
    const { schema } = this.state;
    const {
      match: { params: { layer, id } },
      feature: { [id]: { geom } },
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
      schema: {
        ...schema,
        properties: Object.keys(schema.properties).reduce((list, prop) => ({
          ...list,
          [prop]: {
            ...schema.properties[prop],
            default: formData[prop],
          },
        }), {}),
      },
    });

    await saveFeature(layer, id, { geom, properties: formData });
    this.setState({
      loading: false,
    });
  }

  render () {
    const { loading, schema, schema: { properties } } = this.state;
    const { t } = this.props;
    if (!properties) return null;
    const { name: { default: title } = {} } = properties;
    return (
      <div className="details ">
        <div className="details__header">
          <h2 className="details__title">{title || t('rando.details.noFeature')}</h2>
        </div>
        <div className="details_content">
          <Form
            schema={schema}
            onSubmit={({ formData }) => this.submitFeature(formData)}
          >
            <Button intent="primary" loading={loading} type="submit"> {t('rando.details.save')}</Button>
          </Form>
        </div>
      </div>
    );
  }
}

export default connectRandoProvider('feature', 'saveFeature')(withRouter(withNamespaces()(Update)));
