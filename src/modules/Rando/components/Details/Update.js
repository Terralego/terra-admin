import React from 'react';
import { withNamespaces } from 'react-i18next';
import Form from 'react-jsonschema-form';
import { connectRandoProvider } from '../../services/RandoProvider';

class Update extends React.Component {
  state = {
    schemaToForm: {},
  }

  componentDidMount () {
    this.setSchemaForm();
  }

  componentDidUpdate ({ feature: { properties: prevProperties } }) {
    const { feature: { properties } } = this.props;
    if (properties !== prevProperties) {
      this.setSchemaForm();
    }
  }

  setSchemaForm = () => {
    const {
      feature: { properties },
      layer: { schema },
    } = this.props;
    this.setState({
      schemaToForm: {
        type: 'object',
        ...schema,
        properties: Object.keys(schema.properties).reduce((list, prop) => ({
          ...list,
          [prop]: {
            ...schema.properties[prop],
            default: properties[prop] || '',
          },
        }), {}),
      },
    });
  }

  render () {
    const {
      paramLayer,
      paramId,
      feature: { properties, geom },
      saveFeatureAction,
      t,
    } = this.props;
    const { schemaToForm } = this.state;

    if (!Object.keys(properties).length) return null;

    return (
      <div className="details">
        <h2 className="details__title">{properties.name || t('rando.details.noFeature')}</h2>
        <div className="details_content">
          <Form
            schema={schemaToForm}
            onSubmit={({ formData }) =>
              saveFeatureAction(paramLayer, paramId, { geom, properties: formData })
            }
          />
        </div>
      </div>
    );
  }
}
export default connectRandoProvider('saveFeatureAction')(withNamespaces()(Update));
