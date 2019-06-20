import React from 'react';
import Form from 'react-jsonschema-form';
import { Button } from '@blueprintjs/core';
import { CONTROL_DRAW, CONTROLS_TOP_LEFT } from '@terralego/core/modules/Map';

import { ACTION_CREATE, ACTION_UPDATE } from '../../../views/Map/Map';
import { toast } from '../../../../../utils/toast';
import { generateURI } from '../../../config';
import Actions from '../Actions';

class Edit extends React.Component {
  state = {
    loading: false,
    schema: {},
    geom: {},
    formTouched: false,
    geomTouched: false,
  }

  componentDidMount () {
    const {
      schema,
      paramId,
      feature: { [paramId]: { geom = {} } = {} } = {},
    } = this.props;
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
      paramLayer,
      updateControls,
    } = this.props;
    // Remove controlDraw from controls
    updateControls([]);
    map.setFilter(`terralego-${paramLayer}`, ['all']);
  }

  updateSchema = schema => {
    this.setState({ schema });
  }

  initDraw = () => {
    const {
      map,
      paramLayer,
      paramId,
      feature,
      updateControls,
      action,
    } = this.props;
    let control = {
      control: CONTROL_DRAW,
      position: CONTROLS_TOP_LEFT,
      onDrawUpdate: this.updateGeometry,
    };
    if (action === ACTION_UPDATE) {
      if (!feature) return;
      control = {
        ...control,
        controls: {
          line_string: false,
          polygon: false,
          point: false,
          trash: false,
          combine_features: false,
          uncombine_features: false,
        },
      };
      const layers = `terralego-${paramLayer}`;
      const { [paramId]: { geom } } = feature;
      const listener = ({ control: addedControl }) => {
        if (addedControl !== control.control) return;
        map.draw.add(geom);
        map.off('control_added', listener);
      };
      map.on('control_added', listener);
      map.setFilter(layers, ['!=', '_id', paramId]);
    } else {
      control = {
        ...control,
        onDrawCreate: this.updateGeometry,
        onDrawDelete: this.updateGeometry,
      };
    }
    updateControls([control]);
  }

  updateGeometry = ({ type, features: [{ geometry: geom, id }], target: map }) => {
    const { action } = this.props;
    if (action === ACTION_CREATE) {
      const isDeleted = type === 'draw.delete';
      this.setState({
        geomTouched: !isDeleted,
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
    }
    this.setState({
      geom,
      geomTouched: true,
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
    const { history: { push }, action } = this.props;
    const { geom, geomTouched, formTouched } = this.state;
    const {
      layer: { id: layerId },
      paramId,
      paramLayer,
      saveFeature,
      t,
    } = this.props;

    const isActionUpdate = action === ACTION_UPDATE;

    if (!formTouched && !geomTouched) {
      return;
    }

    this.setState({
      loading: true,
    });

    const savedFeature = await saveFeature(
      layerId,
      isActionUpdate ? paramId : false,
      { geom, properties: formData },
    );

    if (savedFeature !== null && !isActionUpdate) {
      push(generateURI('layer', { layer: paramLayer, id: savedFeature.identifier, action: 'update' }));
    }

    toast.displayToaster(
      { id: savedFeature ? savedFeature.identifier : false },
      t(isActionUpdate ? 'rando.details.successUpdateFeature' : 'rando.details.successCreateFeature'),
      t(isActionUpdate ? 'rando.details.failUpdateFeature' : 'rando.details.failCreateFeature'),
    );

    this.setState({
      loading: false,
      formTouched: false,
      geomTouched: false,
    });
  }

  render () {
    const { loading, schema, schema: { properties } } = this.state;
    const { t, action, paramLayer, paramId } = this.props;
    const { name: { default: title } = {} } = properties || {};
    const mainTitle = action === ACTION_CREATE
      ? t('rando.details.create', { layer: paramLayer })
      : (title || t('rando.details.noFeature'));
    const button = action === ACTION_CREATE ? mainTitle : t('rando.details.save');
    return (
      <div className="details ">
        <div className="details__header">
          <h2 className="details__title">{mainTitle}</h2>
        </div>
        <div className="details__content">
          {properties
            ? (
              <Form
                schema={schema}
                onSubmit={this.submitFeature}
                onChange={this.changeForm}
              >
                <Button
                  intent="primary"
                  loading={loading}
                  type="submit"
                >
                  {button}
                </Button>
              </Form>
            )
            : (
              <Button
                intent="primary"
                loading={loading}
                type="button"
                onClick={() => this.submitFeature({})}
              >
                {button}
              </Button>
            )
        }
        </div>
        {action === ACTION_UPDATE && (
          <Actions id={paramId} layer={paramLayer} displayDelete />
        )}
      </div>
    );
  }
}

export default Edit;
