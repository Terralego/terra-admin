import React from 'react';
import classnames from 'classnames';
import { NavLink } from 'react-router-dom';
import { Icon } from '@blueprintjs/core';
import { getBounds } from '../../services/features';
import Loading from '../../../../components/Loading';

import Read from './Read';
import Update from './Update';
import './styles.scss';

const ACTIONS = {
  read: Read,
  update: Update,
};

class Details extends React.Component {
  state = {
    schema: {},
  }

  componentDidMount () {
    this.getData();
    this.setSchema();
  }

  componentDidUpdate ({
    paramLayer: prevParamlayer, paramId: prevParamId,
    feature: {
      [prevParamId]: {
        geom: { coordinates: prevCoordinates = [] } = {},
        properties: prevProperties,
      } = {},
    } = {},
    layer: prevLayer,
  }) {
    const {
      paramLayer, paramId,
      feature: { [paramId]: { geom: { coordinates = [] } = {}, properties } = {} } = {},
      map,
      layer,
    } = this.props;

    if (prevParamlayer !== paramLayer || prevParamId !== paramId || prevLayer !== layer) {
      this.getData();
    }

    if (properties !== prevProperties) {
      this.setSchema();
    }

    if (prevCoordinates.join() !== coordinates.join() || prevParamId !== paramId) {
      if (!coordinates.length) return;
      const bounds = getBounds(coordinates);
      map.fitBounds(bounds, { padding: 20 });
    }
  }

  getData () {
    const { layer, paramId, fetchFeature } = this.props;
    if (layer && paramId) {
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
    if (properties && schema) {
      this.setState({
        schema: {
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
  }

  render () {
    const {
      feature,
      visible,
      paramLayer,
      paramAction,
      t,
    } = this.props;
    const { schema } = this.state;
    const ComponentAction = ACTIONS[paramAction];
    if (!ComponentAction) {
      return null;
    }
    return (
      <div className={classnames('rando-details', { 'rando-details--visible': visible })}>
        <div className="rando-details__close">
          <NavLink to={`/rando/map/${paramLayer}`}>
            <span className="bp3-button bp3-minimal">
              <Icon icon="cross" title={t('rando.details.close')} />
            </span>
          </NavLink>
        </div>
        <div className="rando-details__content">
          {!feature ? (
            <Loading spinner />
          ) : (
            <ComponentAction schema={schema} />
          )}
        </div>
      </div>
    );
  }
}

export default Details;
