import React from 'react';
import classnames from 'classnames';
import { NavLink } from 'react-router-dom';
import { Icon } from '@blueprintjs/core';
import { ACTION_CREATE, ACTION_UPDATE } from '../../views/Map/Map';
import { getBounds } from '../../services/features';
import Loading from '../../../../components/Loading';
import { generateURI } from '../../config';

import Create from './Create';
import Read from './Read';
import Update from './Update';
import './styles.scss';

class Details extends React.Component {
  state = {
    schema: {},
  }

  componentDidMount () {
    this.getData();
    this.setSchema();
  }

  componentDidUpdate ({
    paramId: prevParamId,
    paramLayer: prevParamlayer,
    paramAction: prevParamAction,
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
      feature: { [paramId]: { geom: { coordinates = [] } = {}, properties } = {} } = {},
      map,
      layer,
    } = this.props;


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
              default: properties ? properties[prop] : '',
            },
          }), {}),
        },
      });
    }
  }

  get ComponentAction () {
    const {
      paramId,
      paramAction,
    } = this.props;
    if (paramId === ACTION_CREATE) {
      return Create;
    }
    if (paramAction === ACTION_UPDATE) {
      return Update;
    }
    return Read;
  }

  render () {
    const {
      feature,
      visible,
      paramLayer,
      paramId,
      t,
      updateControls,
    } = this.props;
    const { schema } = this.state;
    const { ComponentAction } = this;
    if (!ComponentAction) {
      return null;
    }
    return (
      <div className={classnames('rando-details', { 'rando-details--visible': visible })}>
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
            <ComponentAction schema={schema} updateControls={updateControls} />
          )}
        </div>
      </div>
    );
  }
}

export default Details;
