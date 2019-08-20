import React from 'react';
import classnames from 'classnames';
import { Redirect } from 'react-router-dom';
import InteractiveMap, { INTERACTION_FN } from '@terralego/core/modules/Map/InteractiveMap';
import { DEFAULT_CONTROLS, CONTROL_CAPTURE, CONTROLS_TOP_RIGHT } from '@terralego/core/modules/Map';

import DataTable from '../../components/DataTable';
import DetailsWrapper from '../../components/DetailsWrapper';
import Details from '../../components/Details';
import { getBounds } from '../../services/features';
import { getLayerFromCRUD, getSourcesFromCRUD, getLayersPaintsFromCRUD } from '../../services/CRUD';
import Loading from '../../../../components/Loading';
import { generateURI } from '../../config';
import { toast } from '../../../../utils/toast';

import './styles.scss';

export const ACTION_CREATE = 'create';
export const ACTION_UPDATE = 'update';
export const CONTROL_CAPTURE_POSITION = {
  control: CONTROL_CAPTURE,
  position: CONTROLS_TOP_RIGHT,
};

export class Map extends React.Component {
  state = {
    interactions: [],
    customStyle: undefined,
    controls: [...DEFAULT_CONTROLS, CONTROL_CAPTURE_POSITION],
    tableSize: 'medium', // 'minified', 'medium', 'full'
  }

  details = React.createRef();

  dataTable = React.createRef();

  componentDidMount () {
    const { getSettings, getMapConfig, match: { params: { layer } } } = this.props;
    getSettings();
    getMapConfig();
    this.generateLayersToMap();
    this.setInteractions();
    if (layer) {
      this.loadFeatures();
    }
  }

  componentDidUpdate ({
    map: prevMap,
    settings: prevSettings,
    match: { params: { layer: prevLayer, id: prevId } },
    featuresList: prevFeaturesList,
  }) {
    const {
      settings,
      match: { params: { layer, id, action } },
      map,
      featuresList,
      feature: { [id]: { geom: { coordinates = [] } = {} } = {} } = {},
    } = this.props;


    const { customStyle: { layers } = {}, addHighlight, removeHighlight } = this.state;

    if (settings !== prevSettings) {
      this.generateLayersToMap();
      this.setInteractions();
    }

    if (layer !== prevLayer || map !== prevMap) {
      this.displayCurrentLayer(layer);
    }

    if (settings !== prevSettings || layer !== prevLayer || map !== prevMap) {
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
        const { id: layerId, source } = layers.find(({ 'source-layer': sourceLayer }) => sourceLayer === layer) || {};
        if (!layerId) {
          return;
        }
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
      const { id: layerId } = layers.find(({ 'source-layer': sourceLayer }) => sourceLayer === prevLayer) || {};
      if (!layerId) {
        return;
      }
      removeHighlight && removeHighlight({
        layerId,
        featureId: prevId,
      });
    }
  }

  setInteractions = () => {
    const {
      history: { push },
      displayViewFeature,
      settings,
    } = this.props;
    const layers = getLayersPaintsFromCRUD(settings);
    const interactions = layers.map(interaction => {
      if (displayViewFeature) {
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
      interactions,
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
    const { getFeaturesList, settings, match: { params: { layer: paramLayer } } } = this.props;
    const layer = getLayerFromCRUD(settings, paramLayer);
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
    controls: [...controls, ...DEFAULT_CONTROLS, CONTROL_CAPTURE_POSITION],
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
    const { id: layerId, source } = layers.find(({ 'source-layer': sourceLayer }) => sourceLayer === layer) || {};
    if (!layerId) {
      return;
    }
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
    const { settings } = this.props;
    if (!settings) {
      return;
    }

    this.setState({
      customStyle: {
        sources: getSourcesFromCRUD(settings),
        layers: getLayersPaintsFromCRUD(settings),
      },
    });
  }

  render () {
    const { customStyle, interactions, controls, tableSize } = this.state;
    const {
      map,
      mapConfig,
      mapIsResizing,
      settings,
      match: { params: { layer = false, id } },
      t,
    } = this.props;
    const isSettingsLoaded = Object.keys(settings).length > 1;
    const isDataLoaded = Object.keys(mapConfig).length > 1 && isSettingsLoaded;
    const isDetailsVisible = !!id;

    if (isSettingsLoaded && layer && !getLayerFromCRUD(settings, layer)) {
      toast.displayError(t('CRUD.layer.errorNoLayer'));
      return <Redirect to={generateURI('layer')} />;
    }
    return (
      <>
        {!isDataLoaded
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
                    layerName={layer}
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
