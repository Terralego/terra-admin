import React from 'react';
import classnames from 'classnames';
import { Button } from '@blueprintjs/core';
import { getBounds } from '../../services/features';

import Read from './Read';
import Update from './Update';
import './styles.scss';

class Details extends React.Component {
  actionComponents = {
    read: Read,
    update: Update,
  };

  componentDidMount () {
    this.getData();
  }

  componentDidUpdate ({
    paramLayer: prevParamlayer, paramId: prevParamId,
    feature: { geom: { coordinates: prevCoordinates = [] } = {} } = {},
  }) {
    const {
      paramLayer, paramId,
      feature: { geom: { coordinates = [] } = {} } = {},
      map,
    } = this.props;
    if (prevParamlayer !== paramLayer || prevParamId !== paramId) {
      this.getData();
    }
    if (prevCoordinates.join() !== coordinates.join()) {
      const bounds = getBounds(coordinates);
      map.fitBounds(bounds, { padding: 20 });
    }
  }

  getData () {
    const { layer, paramId, getFeature } = this.props;
    if (layer && paramId) {
      const { id: layerId } = layer;
      getFeature(layerId, paramId);
    }
  }

  render () {
    const {
      feature,
      visible,
      historyPush,
      paramLayer,
      paramAction,
      paramId,
      layer,
    } = this.props;

    const ComponentAction = this.actionComponents[paramAction] || false;
    if (!ComponentAction) {
      return null;
    }
    return (
      <div className={classnames('rando-details', { 'rando-details--visible': visible })}>
        <div className="rando-details__close">
          <Button
            type="button"
            className="rando-details__close-button"
            onClick={() => historyPush(`/rando/map/layer/${paramLayer}`)}
            icon="cross"
            minimal
          />
        </div>
        <div className="rando-details__content">
          {!feature ? (
            <div>Loading...</div>
          ) : (
            <ComponentAction paramLayer={paramLayer} paramId={paramId} layer={layer} feature={feature} historyPush={historyPush} />
          )}
        </div>
      </div>
    );
  }
}

export default Details;
