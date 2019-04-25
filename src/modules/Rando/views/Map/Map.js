import React from 'react';
import classnames from 'classnames';
import InteractiveMap, { INTERACTION_FN } from 'mc-tf-test/modules/Map/InteractiveMap';

import DataTable from '../../components/DataTable';
import Details from '../../components/Details';
import mockedCustomStyle from './mockedCustomStyle';
import mockedInteraction from './mockedInteraction';
import { getBounds } from '../../services/features';

import './styles.scss';

export const INTERACTION_VIEW_FEATURE = 'viewFeature';
export class Map extends React.Component {
  state = {
    interactions: [],
    customStyle: undefined,
  }

  componentDidMount () {
    const { getMapConfig, match: { params: { layer } } } = this.props;
    getMapConfig();
    this.generateLayersToMap();
    this.setInteractions();
    if (layer) {
      this.loadFeatures();
    }
  }

  componentDidUpdate ({
    map: prevMap,
    layersList: prevLayersList,
    match: { params: { layer: prevLayer, action: prevAction, id: prevId } },
    featuresList: prevFeaturesList,
  }) {
    const {
      layersList,
      match: { params: { layer, action, id } },
      resizingMap,
      map,
      featuresList,
    } = this.props;
    if (layersList !== prevLayersList) {
      this.generateLayersToMap();
    }
    if (layer !== prevLayer || map !== prevMap) {
      this.displayCurrentLayer(layer);
    }
    if (layersList !== prevLayersList || layer !== prevLayer || map !== prevMap) {
      this.loadFeatures();
    }
    if (action !== prevAction) {
      resizingMap();
    }
    if (!id && featuresList && (prevId !== id || featuresList !== prevFeaturesList)) {
      this.setFitBounds();
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

  setFitBounds = () => {
    const { featuresList, map } = this.props;
    const coordinates = featuresList.map(feature => feature.geom.coordinates);
    const bounds = getBounds(coordinates);
    map.resize();
    map.fitBounds(bounds, { padding: 20 });
  }

  getLayerFromList () {
    const { layersList, match: { params: { layer } } } = this.props;
    return layersList.find(({ name }) => name === layer);
  }

  resetMap = map => {
    const { setMap } = this.props;
    setMap(map);
    map.resize();
  }

  loadFeatures = () => {
    const { getFeaturesList } = this.props;
    const layer = this.getLayerFromList();
    if (!layer) return;
    getFeaturesList(layer.id);
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
