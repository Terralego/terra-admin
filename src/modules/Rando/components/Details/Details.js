import React from 'react';
import { NavLink, Redirect } from 'react-router-dom';
import { Icon } from '@blueprintjs/core';

import { ACTION_CREATE, ACTION_UPDATE } from '../../views/Map/Map';
import { getBounds } from '../../services/features';
import Loading from '../../../../components/Loading';
import { generateURI } from '../../config';
import { toast } from '../../../../utils/toast';

import Read from './Read';
import Edit from './Edit';
import './styles.scss';

class Details extends React.Component {
  state = {
    schema: {},
  }

  componentDidMount () {
    const { paramId, detailsHasLoaded } = this.props;
    this.getData();
    this.setSchema();
    if (paramId === ACTION_CREATE) {
      detailsHasLoaded();
    }
  }

  componentDidUpdate ({
    paramId: prevParamId,
    paramLayer: prevParamlayer,
    paramAction: prevParamAction,
    feature: prevFeature,
    feature: {
      [prevParamId]: {
        geom: { coordinates: prevCoordinates = [] } = {},
        properties: prevProperties,
      } = {},
    } = {},
    layer: prevLayer,
  }) {
    const {
      paramId,
      paramLayer,
      paramAction,
      feature,
      feature: { [paramId]: { geom: { coordinates = [] } = {}, properties } = {} } = {},
      map,
      layer,
      detailsHasLoaded,
    } = this.props;

    if (feature !== prevFeature) {
      detailsHasLoaded();
    }

    if (prevParamlayer !== paramLayer || prevParamId !== paramId || prevLayer !== layer) {
      this.getData();
    }

    if (
      properties !== prevProperties
      || prevParamId !== paramId
      || prevParamAction !== paramAction
    ) {
      this.setSchema();
    }

    if (prevCoordinates.join() !== coordinates.join() || prevParamId !== paramId) {
      if (!coordinates.length) return;
      const bounds = getBounds(coordinates);
      map.fitBounds(bounds, { padding: 20 });
    }
  }

  get isCreateAction () {
    const { paramId } = this.props;
    return paramId === ACTION_CREATE;
  }

  getData () {
    const { layer, paramId, fetchFeature } = this.props;
    if (layer && paramId && !this.isCreateAction) {
      const { id: layerId } = layer;
      fetchFeature(layerId, paramId);
    }
  }

  setSchema = () => {
    const {
      paramId,
      feature: { [paramId]: { properties } = {} } = {},
      layer: { schema } = {},
    } = this.props;
    if (schema) {
      this.setState({
        schema: {
          type: 'object',
          ...schema,
          properties: Object.keys(schema.properties).reduce((list, prop) => ({
            ...list,
            [prop]: {
              ...schema.properties[prop],
              default: properties && paramId !== ACTION_CREATE ? properties[prop] : '',
            },
          }), {}),
        },
      });
    }
  }

  renderContent = () => {
    const {
      paramId,
      paramAction,
      updateControls,
    } = this.props;
    const { schema } = this.state;
    if (paramId === ACTION_CREATE || paramAction === ACTION_UPDATE) {
      return (
        <Edit
          schema={schema}
          updateControls={updateControls}
          action={paramAction || paramId}
        />
      );
    }
    return <Read schema={schema} />;
  }

  render () {
    const {
      feature,
      paramLayer,
      paramId,
      t,
      hasError,
      errorCode,
    } = this.props;

    if (hasError && errorCode === 'Not Found') {
      toast.displayError(t('rando.details.errorNoFeature'));
      return <Redirect to={generateURI('layer', { layer: paramLayer })} />;
    }

    return (
      <>
        <div className="rando-details__close">
          <NavLink to={generateURI('layer', { layer: paramLayer })}>
            <span className="bp3-button bp3-minimal">
              <Icon icon="cross" title={t('rando.details.close')} />
            </span>
          </NavLink>
        </div>
        <div className="rando-details__content">
          {!feature && paramId !== ACTION_CREATE ? (
            <Loading spinner />
          ) : (
            <>{this.renderContent()}</>
          )}
        </div>
      </>
    );
  }
}

export default Details;
