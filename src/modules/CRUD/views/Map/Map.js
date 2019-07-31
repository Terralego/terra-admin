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

  dataTable = React.createRef();

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
      match: { params: { layer, id, action } },
      map,
      featuresList,
      feature: { [id]: { geom: { coordinates = [] } = {} } = {} } = {},
    } = this.props;


    const { customStyle: { layers } = {}, addHighlight, removeHighlight } = this.state;

    if (layersList !== prevLayersList) {
      this.generateLayersToMap();
    }

    if (layer !== prevLayer || map !== prevMap) {
      this.displayCurrentLayer(layer);
    }

    if (layersList !== prevLayersList || layer !== prevLayer || map !== prevMap) {
      this.loadFeatures();
    }

    if (
      (!id || id === ACTION_CREATE)
      && featuresList.length
      && (prevId !== id || featuresList !== prevFeaturesList)
    ) {
      this.setFitBounds();
    } else if (id && coordinates.length) {
      this.setFitBounds(coordinates);
      if (action !== ACTION_UPDATE) {
        const { id: layerId, source } = layers.find(({ 'source-layer': sourceLayer }) => sourceLayer === layer);
        addHighlight({
          layerId,
          featureId: id,
          highlightColor: 'red',
          unique: true,
          source,
        });
      }
    }

    if ((prevId && prevId !== ACTION_CREATE && !id) || action === ACTION_UPDATE) {
      const { id: layerId } = layers.find(({ 'source-layer': sourceLayer }) => sourceLayer === prevLayer);
      removeHighlight && removeHighlight({
        layerId,
        featureId: prevId,
      });
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

    const { current: detail } = this.details;
    const { current: dataTable } = this.dataTable;

    setTimeout(() => {
      const padding = {
        top: 20,
        right: (id && detail) ? (detail.offsetWidth + 50) : 50,
        bottom: !id ? (dataTable.offsetHeight + 20) : 20,
        left: 20,
      };
      map.resize();
      map.fitBounds(getBounds(coords), { padding });
    }, 500);
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

  interactiveMapInit = ({ addHighlight, removeHighlight }) => {
    this.setState({
      addHighlight,
      removeHighlight,
    });
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
    this.setState({ tableSize });
    if (tableSize !== 'full') {
      this.setFitBounds();
    }
  }

  onTableHoverCell = (featureId, hover = true) => {
    const { match: { params: { layer } } } = this.props;
    const { customStyle: { layers = [] } = {}, addHighlight, removeHighlight } = this.state;
    const { id: layerId, source } = layers.find(({ 'source-layer': sourceLayer }) => sourceLayer === layer);
    if (hover) {
      addHighlight({
        layerId,
        featureId,
        highlightColor: 'red',
        unique: true,
        source,
      });
    } else {
      removeHighlight({
        layerId,
        featureId,
      });
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
      toast.displayError(t('CRUD.layer.errorNoLayer'));
      return <Redirect to={generateURI('layer')} />;
    }
    return (
      <>
        {!isConfigLoaded
          ? <Loading spinner />
          : (
            <>
              {map && (
                <DetailsWrapper detailsRef={this.details}>
                  {isDetailsVisible && (
                  <Details
                    updateControls={this.updateControls}
                  />
                  )}
                </DetailsWrapper>
              )}
              {map && (
                <div
                  ref={this.dataTable}
                  className={classnames(
                    {
                      'CRUD-table': true,
                      'CRUD-table--active': layer && !isDetailsVisible,
                      [`CRUD-table--${tableSize}`]: layer && !isDetailsVisible,
                    },
                  )}
                >
                  <DataTable
                    onTableSizeChange={this.onTableSizeChange}
                    tableSize={tableSize}
                    source={layer}
                    onHoverCell={this.onTableHoverCell}
                  />
                </div>
              )}
              <div
                className={classnames(
                  'CRUD-map',
                  { 'CRUD-map--is-resizing': mapIsResizing },
                )}
              >
                <InteractiveMap
                  onMapLoaded={this.resetMap}
                  {...mapConfig}
                  customStyle={customStyle}
                  interactions={interactions}
                  controls={controls}
                  onInit={this.interactiveMapInit}
                />
              </div>
            </>
          )}
      </>
    );
  }
}

export default Map;
