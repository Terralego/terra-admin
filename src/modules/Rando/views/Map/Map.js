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
    tableSize: 'medium', // 'minified', 'medium', 'full'
  }

  details = React.createRef();

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
    match: { params: { layer: prevLayer, id: prevId } },
    featuresList: prevFeaturesList,
  }) {
    const {
      layersList,
      match: { params: { layer, id } },
      resizingMap,
      map,
      featuresList,
      feature: { [id]: { geom: { coordinates = [] } = {} } = {} } = {},
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

    if (prevId !== id && [prevId, id].includes(undefined)) {
      resizingMap();
    }

    if (
      (!id || id === ACTION_CREATE)
      && featuresList.length
      && (prevId !== id || featuresList !== prevFeaturesList)
    ) {
      this.setFitBounds();
    } else if (id && coordinates.length) {
      this.setFitBounds(coordinates);
    }
  }

  setInteractions = () => {
    const { history: { push }, displayViewFeature } = this.props;
    const { interactions = [] } = mockedInteraction;
    const newInteractions = interactions.map(interaction => {
      if (interaction.interaction === INTERACTION_VIEW_FEATURE && displayViewFeature) {
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

  setFitBounds = (coordinates = false) => {
    const {
      map,
      featuresList,
      match: { params: { id } },
    } = this.props;
    const coords = coordinates || featuresList.map(feature => feature.geom.coordinates);

    if (!coords.length || !map) return;

    const { current } = this.details;

    const padding = {
      top: 20,
      right: (id && current) ? (current.offsetWidth + 20) : 20,
      bottom: 20,
      left: 20,
    };

    setTimeout(() => {
      map.resize();
      map.fitBounds(getBounds(coords), { padding });
    }, 800);
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

  onTableSizeChange = tableSize => {
    const { resizingMap } = this.props;
    this.setState({ tableSize });
    if (tableSize !== 'full') {
      resizingMap();
      this.setFitBounds();
    }
  }

  generateLayersToMap () {
    this.setState({
      customStyle: {
        ...mockedCustomStyle,
      },
    });
  }

  render () {
    const { customStyle, interactions, controls, tableSize } = this.state;
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
                {map && (
                  <DetailsWrapper detailsRef={this.details}>
                    {isDetailsVisible && (
                      <Details
                        updateControls={this.updateControls}
                      />
                    )}
                  </DetailsWrapper>
                )}
                <InteractiveMap
                  onMapLoaded={this.resetMap}
                  {...mapConfig}
                  customStyle={customStyle}
                  interactions={interactions}
                  controls={controls}
                />
              </div>
              {map && (
                <div
                  className={classnames(
                    'rando-map__table',
                    { 'rando-map__table--active': layer && !isDetailsVisible },
                    { [`rando-map__table--${tableSize}`]: layer && !isDetailsVisible },
                  )}
                >
                  <DataTable
                    onTableSizeChange={this.onTableSizeChange}
                    tableSize={tableSize}
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
