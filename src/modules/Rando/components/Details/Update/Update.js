import React from 'react';
import Form from 'react-jsonschema-form';
import { Button } from '@blueprintjs/core';
import { CONTROL_DRAW, CONTROLS_TOP_LEFT } from '@terralego/core/modules/Map';


class Update extends React.Component {
  state = {
    loading: false,
    schema: {},
    geom: {},
    geomChanged: false,
  }

  componentDidMount () {
    const { schema, match: { params: { id } }, feature: { [id]: { geom } } } = this.props;
    this.setState({
      schema,
      geom,
    });
    this.initDraw();
  }

  componentDidUpdate ({ schema: prevSchema, feature: prevFeature }) {
    const { feature, schema } = this.props;
    if (prevFeature !== feature) {
      this.initDraw();
    }
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
    const {
      map,
      match: { params: { layer, id } },
      feature,
      updateControls,
    } = this.props;
    const layers = `terralego-${layer}`;
    if (!feature) return;
    const { [id]: { geom } } = feature;
    const control = {
      control: CONTROL_DRAW,
      controls: {
        line_string: false,
        polygon: false,
        point: false,
        trash: false,
        combine_features: false,
        uncombine_features: false,
      },
      position: CONTROLS_TOP_LEFT,
      onDrawUpdate: this.updateGeometry,
    };
    updateControls([control]);
    const listener = ({ control: addedControl }) => {
      if (addedControl !== control.control) return;
      map.draw.add(geom);
      map.off('control_added', listener);
    };
    map.on('control_added', listener);
    map.setFilter(layers, ['!=', '_id', id]);
  }

  submitFeature = async formData => {
    const { schema, geom, geomChanged } = this.state;
    const {
      match: { params: { layer, id } },
      saveFeature,
    } = this.props;

    const formHasChanged = geomChanged || Object.keys(formData).some(prop => (
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

  updateGeometry = ({ features: [{ geometry: geom }] }) => {
    this.setState({
      geom,
      geomChanged: true,
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
            onChange={this.changeForm}
          >
            <Button intent="primary" loading={loading} type="submit"> {t('rando.details.save')}</Button>
          </Form>
        </div>
      </div>
    );
  }
}

export default Update;
