import React from 'react';
import classnames from 'classnames';
import { Redirect } from 'react-router-dom';
import InteractiveMap, { INTERACTION_FN } from '@terralego/core/modules/Map/InteractiveMap';
import { DEFAULT_CONTROLS } from '@terralego/core/modules/Map';

import DataTable from '../../components/DataTable';
import DetailsWrapper from '../../components/DetailsWrapper';
import Details from '../../components/Details';
import mockedCustomStyle from './mockedCustomStyle';
import mockedInteraction from './mockedInteraction';
import { getBounds } from '../../services/features';
import Loading from '../../../../components/Loading';
import { generateURI } from '../../config';
import { toast } from '../../../../utils/toast';

import './styles.scss';

export const ACTION_CREATE = 'create';
export const ACTION_UPDATE = 'update';
export const INTERACTION_VIEW_FEATURE = 'viewFeature';

export class Map extends React.Component {
  state = {
    interactions: [],
    customStyle: undefined,
    controls: DEFAULT_CONTROLS,
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

    if (action !== prevAction || (prevId !== id && [prevId, id].includes(undefined))) {
      resizingMap();
    }

    if (
      (!id || id === ACTION_CREATE)
      && featuresList.length
      && (prevId !== id || featuresList !== prevFeaturesList)
    ) {
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
            push(generateURI('layer', { layer: sourceLayer, id }));
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
    if (map) {
      layers.forEach(({ id, 'source-layer': sourceLayer }) => {
        if (!map.getLayer(id)) return;
        map.setLayoutProperty(id, 'visibility', sourceLayer === currentPath ? 'visible' : 'none');
      });
    }
  }

  updateControls = controls => this.setState({
    controls: [...controls, ...DEFAULT_CONTROLS],
  })

  generateLayersToMap () {
    this.setState({
      customStyle: {
        ...mockedCustomStyle,
      },
    });
  }

  render () {
    const { customStyle, interactions, controls } = this.state;
    const {
      map,
      mapConfig,
      mapIsResizing,
      layersList,
      match: { params: { layer = false, id } },
      t,
    } = this.props;

    const isConfigLoaded = Object.keys(mapConfig).length > 1;
    const isDetailsVisible = !!id;

    if (layersList.length && layer && !layersList.find(({ name }) => name === layer)) {
      toast.displayError(t('rando.layer.errorNoLayer'));
      return <Redirect to={generateURI('layer')} />;
    }
    return (
      <div
        className={classnames(
          'rando-map',
          { 'rando-map--is-resizing': mapIsResizing },
        )}
      >
        {!isConfigLoaded
          ? <Loading spinner />
          : (
            <>
              <div className="rando-map__map">
                <InteractiveMap
                  onMapLoaded={this.resetMap}
                  {...mapConfig}
                  customStyle={customStyle}
                  interactions={interactions}
                  controls={controls}
                />
                <DetailsWrapper>
                  {isDetailsVisible && (
                    <Details
                      updateControls={this.updateControls}
                    />
                  )}
                </DetailsWrapper>
              </div>
              {map && (
              <div
                className={classnames(
                  'rando-map__table',
                  { 'rando-map__table--active': layer && !isDetailsVisible },
                )}
              >
                <DataTable
                  source={layer}
                />
              </div>
              )}
            </>
          )}
      </div>
    );
  }
}

export default Map;
