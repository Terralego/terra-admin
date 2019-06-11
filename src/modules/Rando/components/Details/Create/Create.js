import React from 'react';
import Form from 'react-jsonschema-form';
import { Button } from '@blueprintjs/core';
import { CONTROL_DRAW, CONTROLS_TOP_LEFT } from '@terralego/core/modules/Map';

import { generateURI } from '../../../config';

class Create extends React.Component {
  state = {
    loading: false,
    schema: {},
    geom: {},
    formTouched: false,
  }

  componentDidMount () {
    const { schema } = this.props;
    this.setState({
      schema,
    });
    this.initDraw();
  }

  componentDidUpdate ({ schema: prevSchema }) {
    const { schema } = this.props;
    if (schema !== prevSchema) {
      this.updateSchema(schema);
    }
  }

  componentWillUnmount () {
    const {
      map,
      match: { params: { layer } },
      updateControls,
    } = this.props;
    // Remove controlDraw from controls
    updateControls([]);
    map.setFilter(`terralego-${layer}`, ['all']);
  }

  updateSchema = schema => {
    this.setState({ schema });
  }

  initDraw = () => {
    const { updateControls } = this.props;
    const control = {
      control: CONTROL_DRAW,
      position: CONTROLS_TOP_LEFT,
      onDrawCreate: this.updateGeometry,
      onDrawUpdate: this.updateGeometry,
      onDrawDelete: this.updateGeometry,
    };
    updateControls([control]);
  }

  updateGeometry = ({ type, features: [{ geometry: geom, id }], target: map }) => {
    const isDeleted = type === 'draw.delete';
    this.setState({
      geomAdded: !isDeleted,
    });
    if (isDeleted) {
      return;
    }
    const { features } = map.draw.getAll();
    if (features.length > 1) {
      map.draw.delete(
        features.reduce((list, feature) =>
          (feature.id !== id ? [...list, feature.id] : list),
        []),
      );
    }
    this.setState({
      geom,
      geomAdded: features.length,
    });
  }

  changeForm = ({ formData }) => {
    const { schema } = this.state;
    this.setState({
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
      formTouched: true,
    });
  }

  submitFeature = async ({ formData }) => {
    const { history: { push } } = this.props;
    const { geom, geomAdded, formTouched } = this.state;
    const {
      match: { params: { layer } },
      saveFeature,
    } = this.props;

    if (!formTouched || !geomAdded) {
      return;
    }

    this.setState({
      loading: true,
    });

    const savedFeature = await saveFeature(
      layer,
      false,
      { geom, properties: formData },
    );

    if (savedFeature !== null) {
      push(generateURI('layer', { layer, id: savedFeature.identifier, action: 'update' }));
      return;
    }

    this.setState({
      loading: false,
    });
  }

  render () {
    const { loading, schema, schema: { properties } } = this.state;
    const { t } = this.props;
    if (!properties) return null;

    return (
      <div className="details ">
        <div className="details__header">
          <h2 className="details__title">{t('rando.details.create')}</h2>
        </div>
        <div className="details_content">
          <Form
            schema={schema}
            onSubmit={this.submitFeature}
            onChange={this.changeForm}
          >
            <Button intent="primary" loading={loading} type="submit">{t('rando.details.create')}</Button>
          </Form>
        </div>
      </div>
    );
  }
}

export default Create;
