import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Redirect } from 'react-router-dom';
import InteractiveMap, { INTERACTION_FN } from '@terralego/core/modules/Map/InteractiveMap';
import {
  DEFAULT_CONTROLS,
  CONTROL_CAPTURE,
  CONTROL_BACKGROUND_STYLES,
  CONTROLS_TOP_RIGHT,
} from '@terralego/core/modules/Map';

import Loading from '../../../../components/Loading';
import Message from '../../../../components/Message';
import DataTable from '../../components/DataTable';
import DetailsWrapper from '../../components/DetailsWrapper';
import Details from '../../components/Details';
import { getBounds } from '../../services/features';
import { ACTION_CREATE, ACTION_UPDATE, getView, getSources, getLayersPaints, getFirstCrudViewName } from '../../services/CRUD';
import { generateURI } from '../../config';
import { toast } from '../../../../utils/toast';

import './styles.scss';

const CONTROL_LIST = [{
  control: CONTROL_BACKGROUND_STYLES,
  position: CONTROLS_TOP_RIGHT,
}, {
  control: CONTROL_CAPTURE,
  position: CONTROLS_TOP_RIGHT,
}];

const isTrueFeatureID = id => ![undefined, ACTION_CREATE].includes(id);

export class Map extends React.Component {
  static propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func,
    }).isRequired,
    getSettings: PropTypes.func.isRequired,
    setMap: PropTypes.func.isRequired,
    displayViewFeature: PropTypes.bool,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string,
        layer: PropTypes.string,
      }),
    }),
    settings: PropTypes.shape({}),
    settingsEndpoint: PropTypes.string,
    map: PropTypes.shape({}),
    feature: PropTypes.shape({}),
    backgroundStyle: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        url: PropTypes.string,
      }),
    ),
  };

  static defaultProps = {
    displayViewFeature: true,
    match: {
      params: {
        id: undefined,
        layer: undefined,
      },
    },
    map: {},
    settings: {},
    settingsEndpoint: undefined,
    feature: {},
    backgroundStyle: [],
  }

  state = {
    mapConfig: {},
    interactions: [],
    customStyle: {
      sources: [],
      layers: [],
    },
    controls: [...DEFAULT_CONTROLS, ...CONTROL_LIST],
    tableSize: 'medium', // 'minified', 'medium', 'full'
    refreshingLayers: false,
  }

  details = React.createRef();

  dataTable = React.createRef();

  componentDidMount () {
    const {
      getSettings,
      settingsEndpoint,
      settings,
      map,
      match: { params: { layer } },
    } = this.props;

    if (Object.keys(settings).length > 0) {
      this.setMapConfig();
    } else {
      getSettings(settingsEndpoint);
    }

    if (Object.keys(map).length > 0 && layer) {
      this.generateLayersToMap();
      this.setInteractions();
    }
  }

  componentDidUpdate ({
    map: prevMap,
    settings: prevSettings,
    match: { params: { layer: prevLayer, id: prevId } },
    feature: { geom: { coordinates: prevCoordinates } = {} },
  }) {
    const {
      settings,
      match: { params: { layer, id, action } },
      map,
      feature: { geom: { coordinates } = {} },
    } = this.props;

    const { customStyle: { layers = [] }, addHighlight, removeHighlight } = this.state;

    if (settings !== prevSettings) {
      this.setMapConfig();
    }

    if (settings !== prevSettings || layer !== prevLayer) {
      this.setInteractions();
    }

    if ((layer !== prevLayer || map !== prevMap || prevId !== id) && Object.keys(map).length > 0) {
      this.generateLayersToMap();
    }

    if (layer && (layer !== prevLayer || map !== prevMap)) {
      this.setFitBounds();
    }

    if (isTrueFeatureID(id) && prevCoordinates !== coordinates) {
      this.setFitBounds();
      this.generateLayersToMap();
      if (action !== ACTION_UPDATE) {
        const { id: layerId, source } = layers.find(({ 'source-layer': sourceLayer }) => sourceLayer === layer) || {};
        if (!layerId || !Object.keys(map).length) {
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

    if ((isTrueFeatureID(prevId) && !id) || action === ACTION_UPDATE) {
      const { id: layerId } = layers.find(({ 'source-layer': sourceLayer }) => sourceLayer === prevLayer) || {};
      if (!layerId || !Object.keys(map).length) {
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
      match: { params: { layer } },
      history: { push },
      displayViewFeature,
      settings,
    } = this.props;

    const { layer: { id } = {} } = getView(settings, layer);

    if (!id) {
      return;
    }

    const layers = getLayersPaints(settings);

    const interactions = layers.map(interaction => {
      if (interaction.source !== `${id}`) {
        return false;
      }
      return {
        ...interaction,
        interaction: INTERACTION_FN,
        fn: ({
          feature,
          feature: { sourceLayer, properties: { _id: propId } },
          event,
          instance: { displayTooltip }, layerId,
        }) => {
          displayTooltip({
            layerId,
            feature,
            event,
            template: `{% if name %}{{name}}{% else %}${interaction.title}{% endif %}`,
            fixed: false,
            unique: true,
          });
          if (interaction.main && displayViewFeature) {
            push(generateURI('layer', { layer: sourceLayer, id: propId }));
          }
        },
      };
    }).filter(Boolean);

    this.setState({
      interactions,
    });
  }

  setFitBounds = ({ duration = 0 } = {}) => {
    const {
      map,
      match: { params: { layer, id } },
      settings,
      feature: { geom: { coordinates = [] } = {} },
    } = this.props;

    if (!Object.keys(map).length) return;

    const { extent: [w, s, e, n] } = getView(settings, layer);
    const coords = isTrueFeatureID(id) ? coordinates : [[w, s], [e, n]];

    if (!coords.length) return;

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
      map.fitBounds(getBounds(coords), { padding, duration });
    }, 500);
  }

  setMapConfig () {
    const {
      settings,
      backgroundStyle,
    } = this.props;

    if (!Object.keys(settings).length) {
      return;
    }

    const {
      config: {
        default: {
          map = {},
        } = {},
      } = {},
    } = settings;

    const mapConfig = Object.keys(map).reduce((keys, mapKey) => {
      if (mapKey === 'mapbox_access_token') {
        return { ...keys, accessToken: map[mapKey] };
      }
      return { ...keys, [mapKey]: map[mapKey], backgroundStyle };
    }, {});

    this.setState({
      mapConfig,
    });
  }

  resetMap = map => {
    const { setMap } = this.props;
    setMap(map);
    map.resize();
  }

  interactiveMapInit = ({ addHighlight, removeHighlight, popups }) => {
    this.setState({
      addHighlight,
      removeHighlight,
      popups,
    });
  }

  displayCurrentLayer = () => {
    const {
      map,
      settings,
      match: { params: { layer, id } },
      feature: { extra_geometries: extraGeometries = [] } = {},
    } = this.props;

    const view = getView(settings, layer);

    const { customStyle: { layers = [] } } = this.state;
    if (!Object.keys(map).length || !layers.length) {
      return;
    }

    layers.forEach(layerItem => {
      if (!map.getLayer(layerItem.id)) return;
      const conditionalDisplay = layerItem.source === `${view.layer.id}` && (isTrueFeatureID(id) || layerItem.main === true);
      map.setLayoutProperty(layerItem.id, 'visibility', conditionalDisplay ? 'visible' : 'none');
      if (isTrueFeatureID(id) && layerItem.main === false) {
        map.setFilter(layerItem.id, ['in', '_id', ...extraGeometries]);
      }
    });
  }

  refreshLayers = () => {
    this.displayCurrentLayer();
    this.setState(({ refreshingLayers }) => ({ refreshingLayers: !refreshingLayers }));
  }

  updateControls = controls => this.setState({
    controls: [...controls, ...DEFAULT_CONTROLS, ...CONTROL_LIST],
  })

  onTableSizeChange = tableSize => {
    this.setState({ tableSize });
    if (tableSize !== 'full') {
      this.setFitBounds();
    }
  }

  onTableHoverCell = (featureId, hover = true) => {
    const { map, match: { params: { layer } } } = this.props;
    const { customStyle: { layers = [] }, addHighlight, removeHighlight } = this.state;
    const { id: layerId, source } = layers.find(({ 'source-layer': sourceLayer }) => sourceLayer === layer) || {};
    if (!layerId || !Object.keys(map).length) {
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

  hideAllTooltip = () => {
    const { popups } = this.state;
    popups.forEach(({ popup }) => popup.remove());
    popups.clear();
  }

  generateLayersToMap () {
    const {
      map,
      settings,
      match: { params: { layer } },
    } = this.props;

    const view = getView(settings, layer);

    if (!Object.keys(settings).length || !layer || !view) {
      return;
    }

    const {
      layer: { id: layerId },
      pictogram,
    } = getView(settings, layer);

    this.setState(({ customStyle: { sources: prevSources, layers: prevLayers } }) => {
      if (prevSources.find(({ id }) => id === `${layerId}`) && prevLayers.filter(({ source }) => source === `${layerId}`)) {
        return null;
      }

      const sourcesFromSettings = getSources(settings);
      const layersFromSettings = getLayersPaints(settings);

      const nextSource = sourcesFromSettings.find(({ id }) => id === `${layerId}`);
      const nextLayers = layersFromSettings.filter(({ source }) => source === `${layerId}`);

      nextLayers.forEach(({ layout: { 'icon-image': iconImage } = {} }) => {
        if (iconImage) {
          map.loadImage(pictogram, (error, image) => {
            if (error) throw error;
            map.addImage(iconImage, image);
          });
        }
      });

      return {
        customStyle: {
          sources: [...prevSources, nextSource],
          layers: [...prevLayers, ...nextLayers],
        },
      };
    }, () => {
      this.hideAllTooltip();
      this.displayCurrentLayer();
    });
  }

  render () {
    const {
      customStyle,
      interactions,
      controls,
      tableSize,
      mapConfig,
      refreshingLayers,
    } = this.state;
    const {
      mapIsResizing,
      settings,
      match: { params: { layer, id } },
      backgroundStyle,
      t,
      errors,
    } = this.props;

    if (errors.settings) {
      return (
        <Message intent="danger" className="CRUD-no-settings">
          {t('CRUD.settings.unableToLoad')}
        </Message>
      );
    }

    const areSettingsLoaded = Object.keys(settings).length && Object.keys(mapConfig).length;
    const areDetailsVisible = !!id;

    if (areSettingsLoaded) {
      const firstCrudViewName = getFirstCrudViewName(settings);
      const redirectArgs = firstCrudViewName ? { layer: firstCrudViewName } : {};
      if (layer && !getView(settings, layer)) {
        toast.displayError(t('CRUD.layer.errorNoLayer'));
        return <Redirect to={generateURI('layer', redirectArgs)} />;
      }
      // Redirect to the first item of the menu when no one is selected
      if (layer === undefined && firstCrudViewName) {
        return <Redirect to={generateURI('layer', redirectArgs)} />;
      }
    }

    return (
      <>
        {!areSettingsLoaded
          ? <Loading spinner />
          : (
            <>
              <DetailsWrapper detailsRef={this.details}>
                {areDetailsVisible && (
                  <Details
                    updateControls={this.updateControls}
                    refreshingLayers={refreshingLayers}
                  />
                )}
              </DetailsWrapper>
              <div
                ref={this.dataTable}
                className={classnames(
                  {
                    'CRUD-table': true,
                    'CRUD-table--active': layer && !areDetailsVisible,
                    [`CRUD-table--${tableSize}`]: layer && !areDetailsVisible,
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

              <div
                className={classnames(
                  'CRUD-map',
                  { 'CRUD-map--is-resizing': mapIsResizing },
                )}
              >
                {!!backgroundStyle.length && (
                  <InteractiveMap
                    onMapLoaded={this.resetMap}
                    {...mapConfig}
                    customStyle={customStyle}
                    interactions={interactions}
                    controls={controls}
                    onInit={this.interactiveMapInit}
                    onStyleChange={this.refreshLayers}
                    translate={t}
                  />
                )}
                {!backgroundStyle.length && (
                  <Message intent="danger" className="CRUD-no-map">
                    {t('CRUD.settings.unableToLoadMap')}
                  </Message>
                )}
              </div>
            </>
          )}
      </>
    );
  }
}

export default Map;
