import React from 'react';
import PropTypes from 'prop-types';
import Form from 'react-jsonschema-form';
import { Redirect } from 'react-router-dom';
import { Button } from '@blueprintjs/core';
import { CONTROL_DRAW, CONTROLS_TOP_LEFT } from '@terralego/core/modules/Map';
import RTEField from '../../../../../components/react-json-schemaForm/RTEField';

import { ACTION_CREATE, ACTION_UPDATE } from '../../../services/CRUD';
import { toast } from '../../../../../utils/toast';
import { generateURI } from '../../../config';
import Header from '../Header';
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

const updateSchemaPropertiesValues = (properties, formData) => (
  Object.keys(properties).reduce((list, prop) => ({
    ...list,
    [prop]: {
      ...properties[prop],
      ...(properties[prop].type === 'object')
        ? { properties: updateSchemaPropertiesValues(properties[prop].properties, formData[prop]) }
        : { default: formData[prop] },
    },
  }), {})
);
class Edit extends React.Component {
  static propTypes = {
    map: PropTypes.shape({}),
    feature: PropTypes.shape({
      title: PropTypes.string,
      properties: PropTypes.shape({}),
      geom: PropTypes.shape({}),
    }),
    saveFeature: PropTypes.func.isRequired,
    view: PropTypes.shape({
      formSchema: PropTypes.shape({}),
      layer: PropTypes.shape({ name: PropTypes.string }),
      name: PropTypes.string,
      uiSchema: PropTypes.shape({}),
    }),
    layerPaint: PropTypes.shape({}).isRequired,
    paramLayer: PropTypes.string.isRequired,
    paramId: PropTypes.string.isRequired,
    action: PropTypes.oneOf([ACTION_CREATE, ACTION_UPDATE]).isRequired,
    updateControls: PropTypes.func,
    getSettings: PropTypes.func,
    settingsEndpoint: PropTypes.string,
    displayAddFeature: PropTypes.bool,
    displayChangeFeature: PropTypes.bool,
    history: PropTypes.shape({
      push: PropTypes.func,
    }),
    t: PropTypes.func,
  }

  static defaultProps = {
    map: {},
    feature: {
      title: undefined,
      properties: {},
      geom: {},
    },
    view: {
      formSchema: {},
      layer: { name: undefined },
      name: undefined,
      uiSchema: {},
    },
    displayAddFeature: true,
    displayChangeFeature: true,
    updateControls () {},
    getSettings () {},
    settingsEndpoint: undefined,
    history: {
      push () {},
    },
    t: text => text,
  }

  state = {
    loading: false,
    schema: {
      properties: {},
    },
    geom: {},
  }

  componentDidMount () {
    this.setSchema();

    const {
      action,
      feature: { geom },
    } = this.props;

    if (action !== ACTION_UPDATE || Object.keys(geom).length) {
      this.initDraw();
    }
  }

  componentDidUpdate ({
    paramId: prevParamId,
    action: prevAction,
    feature: prevFeature,
    map: prevMap,
    view: prevView,
    featureError: prevFeatureError,
  }) {
    const {
      action,
      paramId,
      feature,
      map,
      view,
      featureError,
      t,
    } = this.props;
    if (prevFeature !== feature || prevMap !== map) {
      this.initDraw();
    }

    if (
      prevView !== view
      || prevParamId !== paramId
      || prevAction !== action
    ) {
      this.setSchema();
    }

    if (prevFeatureError !== featureError) {
      const { error: { data } } = featureError;
      toast.displayError(
        <div>
          {t(this.isActionUpdate ? 'CRUD.details.failUpdateFeature' : 'CRUD.details.failCreateFeature')}
          {Object.keys(data).map(item => <p key={item}>{item}: {data[item]}</p>)}
        </div>,
      );
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

  buildSchema = (schemaProperties, properties = {}) => {
    const {
      action,
    } = this.props;
    return Object.keys(schemaProperties).reduce((list, prop) => ({
      ...list,
      [prop]: {
        ...schemaProperties[prop],
        ...(schemaProperties[prop].type === 'object')
          ? { properties: this.buildSchema(schemaProperties[prop].properties, properties[prop]) }
          : {},
        ...(action !== ACTION_CREATE && properties[prop] && schemaProperties[prop].type !== 'object')
          ? { default: properties[prop] }
          : {},
      },
    }), {});
  }

  isActionUpdate = () => {
    const { action } = this.props;
    return action === ACTION_UPDATE;
  }

  setSchema = () => {
    const {
      feature: { properties = {}, geom = {} },
      view: { formSchema: schema = {} },
      t,
    } = this.props;
    if (!Object.keys(properties).length && !Object.keys(schema).length) {
      return;
    }
    this.setState(state => {
      const geometryFromMap = {
        type: 'boolean',
        title: t('CRUD.details.geometry'),
        default: !!Object.keys(state.geom).length,
      };
      return {
        geom,
        schema: {
          type: 'object',
          ...schema,
          properties: {
            ...this.buildSchema(schema.properties, properties),
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
      view: { layer: { geom_type: geomType } },
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

    const { view: { layer: { geom_type: geomType } } } = this.props;
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
    const { t } = this.props;

    this.setState(({ schema, geom }) => ({
      schema: {
        ...schema,
        properties: {
          ...updateSchemaPropertiesValues(schema.properties, formData),
          geometryFromMap: {
            type: 'boolean',
            title: t('CRUD.details.geometry'),
            default: !!Object.keys(geom).length,
          },
        },
      },
    }));
  }

  submitFeature = async ({ formData: { geometryFromMap, ...properties } }) => {
    const { geom } = this.state;
    const {
      getSettings,
      history: { push },
      view: { featureEndpoint },
      paramId,
      paramLayer,
      getFeaturesList,
      saveFeature,
      settingsEndpoint,
      t,
    } = this.props;

    this.setState({
      loading: true,
    });

    const savedFeature = await saveFeature(
      featureEndpoint,
      this.isActionUpdate ? paramId : false,
      { geom, properties },
    );

    if (savedFeature) {
      push(generateURI('layer', { layer: paramLayer, id: savedFeature.identifier }));
      getFeaturesList(
        featureEndpoint,
        { querystring: { page_size: 2000 } },
      );
      toast.displayToaster(
        { id: savedFeature.identifier },
        t(this.isActionUpdate ? 'CRUD.details.successUpdateFeature' : 'CRUD.details.successCreateFeature'),
      );
    } else {
      this.setState({
        loading: false,
      });
    }


    getSettings(settingsEndpoint);
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
      view: { layer: { name }, name: displayName = name, uiSchema = {} },
      paramLayer,
      paramId,
      displayAddFeature,
      displayChangeFeature,
      feature: { title },
    } = this.props;

    if (
      (action === ACTION_CREATE && !displayAddFeature)
      || (action === ACTION_UPDATE && !displayChangeFeature)
    ) {
      toast.displayError(t('CRUD.details.noAccess'));
      return (<Redirect to={generateURI('layer', { layer: paramLayer })} />);
    }

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
        <Header title={mainTitle} />
        <div className="details__content bootstrap-inside">
          {Object.keys(properties).length
            ? (
              <Form
                schema={schema}
                uiSchema={{ ...uiSchema, geometryFromMap: { 'ui:widget': 'hidden' } }}
                fields={{
                  rte: RTEField,
                }}
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
