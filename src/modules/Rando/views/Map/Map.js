import React from 'react';
import classnames from 'classnames';
import InteractiveMap, { INTERACTION_FN } from 'mc-tf-test/modules/Map/InteractiveMap';

import DataTable from '../../components/DataTable';
import Details from '../../components/Details';
import mockedCustomStyle from './mockedCustomStyle';
import mockedInteraction from './mockedInteraction';

import './styles.scss';

export const INTERACTION_VIEW_FEATURE = 'viewFeature';
export class Map extends React.Component {
  state = {
    interactions: [],
    customStyle: undefined,
  }

  componentDidMount () {
    const { getMapConfig } = this.props;
    getMapConfig();
    this.generateLayersToMap();
    this.setInteractions();
  }

  componentDidUpdate (
    {
      map: prevMap,
      layersList: prevLayersList,
      match: { params: { layer: prevLayer, action: prevAction } },
    },
  ) {
    const {
      layersList,
      match: { params: { layer, action } },
      resizingMap,
      map,
    } = this.props;
    if (layersList !== prevLayersList) {
      this.generateLayersToMap();
    }
    if (layer !== prevLayer || map !== prevMap) {
      this.displayCurrentLayer(layer);
    }
    if (action !== prevAction) {
      resizingMap();
    }
  }

  setInteractions = () => {
    const { history: { push } } = this.props;
    const { interactions = [] } = mockedInteraction;
    const newInteractions = interactions.map(interaction => {
      if (interaction.interaction === INTERACTION_VIEW_FEATURE) {
        return {
          ...interaction,
          interaction: INTERACTION_FN,
          fn: ({
            feature: { sourceLayer, properties: { _id: id } },
          }) => {
            push(`/rando/map/layer/${sourceLayer}/read/${id}`);
          },
        };
      }
      return interaction;
    });
    this.setState({
      interactions: newInteractions,
    });
  }

  resetMap = map => {
    const { setMap } = this.props;
    setMap(map);
    map.resize();
  }

  displayCurrentLayer = currentPath => {
    const { customStyle: { layers = [] } = {} } = this.state;
    const { map } = this.props;
    layers.forEach(({ id, 'source-layer': sourceLayer }) => {
      if (!map.getLayer(id)) return;
      map.setLayoutProperty(id, 'visibility', sourceLayer === currentPath ? 'visible' : 'none');
    });
  }

  generateLayersToMap () {
    this.setState({
      customStyle: {
        ...mockedCustomStyle,
      },
    });
  }

  render () {
    const { customStyle, interactions } = this.state;
    const {
      map,
      mapConfig,
      mapIsResizing,
      match: { params: { layer = false, action = false } },
    } = this.props;
    const isConfigLoaded = Object.keys(mapConfig).length > 1;
    const isDetailsVisible = action;

    if (!isConfigLoaded) return <div>Loading...</div>;

    return (
      <div
        className={classnames(
          'rando-map',
          { 'rando-map--is-resizing': mapIsResizing },
        )}
      >
        <div className="rando-map__map">
          <InteractiveMap
            onMapLoaded={this.resetMap}
            {...mapConfig}
            customStyle={customStyle}
            interactions={interactions}
          />
          {map && (
            <Details
              visible={isDetailsVisible}
              interactions={interactions}
            />
          )}
        </div>
        {map && (
          <div
            className={classnames(
              'rando-map__table',
              { 'rando-map__table--active': layer && !action },
            )}
          >
            <DataTable
              source={layer}
            />
          </div>
        )}
      </div>
    );
  }
}

export default Map;
