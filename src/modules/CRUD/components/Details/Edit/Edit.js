import React from 'react';
import PropTypes from 'prop-types';
import Form from 'react-jsonschema-form';
import { Redirect } from 'react-router-dom';
import { Button } from '@blueprintjs/core';
import { CONTROL_DRAW, CONTROLS_TOP_LEFT } from '@terralego/core/modules/Map';

import { ACTION_CREATE, ACTION_UPDATE } from '../../../services/CRUD';
import { toast } from '../../../../../utils/toast';
import { generateURI } from '../../../config';
import Actions from '../Actions';
import ErrorListTemplate from './ErrorListTemplate';

import {
  ALL,
  POINT,
  LINESTRING,
  POLYGON,
  MULTI_POINT,
  MULTI_LINESTRING,
  MULTI_POLYGON,
} from '../../../../../utils/geom';

function updateSchemaPropertiesValues (properties, formData) {
  return Object.keys(properties).reduce((list, prop) => ({
    ...list,
    [prop]: {
      ...properties[prop],
      default: formData[prop],
    },
  }), {});
}
class Edit extends React.Component {
  static propTypes = {
    map: PropTypes.shape({}),
    feature: PropTypes.shape({}),
    saveFeature: PropTypes.func.isRequired,
    layer: PropTypes.shape({}).isRequired,
    layerPaint: PropTypes.shape({}).isRequired,
    paramLayer: PropTypes.string.isRequired,
    paramId: PropTypes.string.isRequired,
    action: PropTypes.oneOf([ACTION_CREATE, ACTION_UPDATE]).isRequired,
    updateControls: PropTypes.func.isRequired,
    displayAddFeature: PropTypes.bool,
    displayChangeFeature: PropTypes.bool,
    schema: PropTypes.shape({}).isRequired,
    history: PropTypes.shape({
      push: PropTypes.func,
    }),
  }

  static defaultProps = {
    map: {},
    feature: {},
    displayAddFeature: true,
    displayChangeFeature: true,
    history: {
      push () {},
    },
  }

  state = {
    loading: false,
    schema: {
      properties: {},
    },
    geom: {},
  }

  componentDidMount () {
    this.initEdit();
  }

  componentDidUpdate ({
    schema: prevSchema,
    feature: prevFeature,
    map: prevMap,
  }) {
    const { feature, schema, map } = this.props;
    if (prevFeature !== feature || prevMap !== map) {
      this.initDraw();
    }


    if (schema !== prevSchema) {
      this.updateSchema(schema);
    }
  }

  componentWillUnmount () {
    const {
      map,
      updateControls,
    } = this.props;
    // Remove controlDraw from controls
    updateControls([]);
    if (this.layerId && Object.keys(map).length) {
      map.setFilter(this.layerId, ['all']);
    }
  }

  get layerId () {
    const { layerPaint: { id } } = this.props;
    return id;
  }

  initEdit = () => {
    const {
      schema,
      feature: { geom = {} },
      action,
    } = this.props;

    this.setState({
      schema,
      geom,
    }, () => {
      if (action !== ACTION_UPDATE || Object.keys(geom).length) {
        this.initDraw();
      }
    });
  }

  updateSchema = schema => {
    const { t } = this.props;
    this.setState(({ geom }) => {
      const geometryFromMap = { type: 'boolean', title: t('CRUD.details.geometry'), default: !!Object.keys(geom).length };
      return {
        schema: {
          ...schema,
          properties: {
            ...schema.properties,
            geometryFromMap,
          },
        },
      };
    });
  }

  initDraw = () => {
    const {
      map,
      paramId,
      feature: { geom },
      updateControls,
      action,
      layer: { geom_type: geomType },
    } = this.props;

    const control = {
      control: CONTROL_DRAW,
      position: CONTROLS_TOP_LEFT,
      onDrawUpdate: this.updateGeometry,
      onDrawCreate: this.updateGeometry,
      onDrawDelete: this.updateGeometry,
      controls: {
        point:  [ALL, POINT, MULTI_POINT].includes(geomType),
        line_string: [ALL, LINESTRING, MULTI_LINESTRING].includes(geomType),
        polygon:  [ALL, POLYGON, MULTI_POLYGON].includes(geomType),
        trash: true,
        combine_features: false,
        uncombine_features: false,
      },
    };

    if (action === ACTION_UPDATE) {
      if (!geom || !Object.keys(map).length) return;

      const listener = ({ control: addedControl }) => {
        if (addedControl !== control.control) {
          return;
        }
        map.draw.add(geom);
        map.off('control_added', listener);
      };
      map.on('control_added', listener);
      if (this.layerId) {
        map.setFilter(this.layerId, ['!=', '_id', paramId]);
      }
    }
    updateControls([control]);
  }

  updateGeometry = ({ type, features: [{ geometry: geom, id }], target: map }) => {
    if (type === 'draw.delete') {
      this.setState({ geom: {} });
      return;
    }

    const { layer: { geom_type: geomType } } = this.props;
    const { features } = map.draw.getAll();

    if (features.length > 1 && [POINT, LINESTRING, POLYGON].includes(geomType)) {
      map.draw.delete(
        features.reduce((list, feature) => (
          feature.id !== id
            ? [...list, feature.id]
            : list
        ), []),
      );
    }

    this.setState({ geom });
  }

  changeForm = ({ formData }) => {
    const { schema, geom } = this.state;
    const { t } = this.props;

    const properties = updateSchemaPropertiesValues(schema.properties, formData);
    const geometryFromMap = { type: 'boolean', title: t('CRUD.details.geometry'), default: !!Object.keys(geom).length };

    this.setState({
      schema: {
        ...schema,
        properties: { ...properties, geometryFromMap },
      },
    });
  }

  submitFeature = async ({ formData: { geometryFromMap, ...properties } }) => {
    const { geom } = this.state;
    const {
      history: { push },
      layer: { id: layerId },
      paramId,
      paramLayer,
      saveFeature,
      action,
      t,
    } = this.props;

    const isActionUpdate = action === ACTION_UPDATE;

    this.setState({
      loading: true,
    });

    const savedFeature = await saveFeature(
      layerId,
      isActionUpdate ? paramId : false,
      { geom, properties },
    );

    if (savedFeature) {
      push(generateURI('layer', { layer: paramLayer, id: savedFeature.identifier }));
    } else {
      this.setState({
        loading: false,
      });
    }

    toast.displayToaster(
      { id: savedFeature ? savedFeature.identifier : false },
      t(isActionUpdate ? 'CRUD.details.successUpdateFeature' : 'CRUD.details.successCreateFeature'),
      t(isActionUpdate ? 'CRUD.details.failUpdateFeature' : 'CRUD.details.failCreateFeature'),
    );
  }

  validateForm = (formData, errors) => {
    const { geom } = this.state;
    const { t } = this.props;
    if (!Object.keys(geom).length) {
      errors.geometryFromMap.addError(t('CRUD.details.errorNoGeometry'));
    }
    return errors;
  }

  render () {
    const { loading, schema, schema: { properties } } = this.state;
    const {
      t,
      action,
      layer: { name, displayName = name, uiSchema = {} },
      paramLayer,
      paramId,
      displayAddFeature,
      displayChangeFeature,
    } = this.props;

    if (
      (action === ACTION_CREATE && !displayAddFeature)
      || (action === ACTION_UPDATE && !displayChangeFeature)
    ) {
      toast.displayError(t('CRUD.details.noAccess'));
      return (<Redirect to={generateURI('layer', { layer: paramLayer })} />);
    }

    const { name: { default: title } = {} } = properties || {};
    const mainTitle = action === ACTION_CREATE
      ? t('CRUD.details.create', { layer: displayName })
      : (title || t('CRUD.details.noFeature'));

    const SaveButton = props => (
      <Button
        intent="primary"
        className="details__actions-save"
        loading={loading}
        {...props}
      >
        {action === ACTION_CREATE ? mainTitle : t('CRUD.details.save')}
      </Button>
    );

    const actionsButtons = {
      paramLayer,
      displayCancel: true,
      displayDelete: action === ACTION_UPDATE,
      ...action === ACTION_UPDATE ? { paramId } : {},
    };

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
                uiSchema={{ ...uiSchema, geometryFromMap: { 'ui:widget': 'hidden' } }}
                onSubmit={this.submitFeature}
                onChange={this.changeForm}
                validate={this.validateForm}
                ErrorList={ErrorListTemplate}
              >
                <Actions {...actionsButtons}>
                  <SaveButton type="submit" />
                </Actions>
              </Form>
            )
            : (
              <Actions {...actionsButtons}>
                <SaveButton onClick={() => this.submitFeature({})} />
              </Actions>
            )
          }
        </div>
      </div>
    );
  }
}

export default Edit;
