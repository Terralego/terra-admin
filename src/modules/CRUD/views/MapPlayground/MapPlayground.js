import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Redirect } from 'react-router-dom';
import InteractiveMap, { INTERACTION_FN } from '@terralego/core/modules/Map/InteractiveMap';
import {
  CONTROL_CUSTOM,
  CONTROLS_TOP_LEFT,
} from '@terralego/core/modules/Map';

import Loading from '../../../../components/Loading';
import Message from '../../../../components/Message';
import DataTable from '../../components/DataTable';
import DetailsWrapper from '../../components/DetailsWrapper';
import Details from '../../components/Details';
import { ACTION_CREATE, getView, getSources, getLayers, getFirstCrudViewName } from '../../services/CRUD';
import { TABLE_MEDIUM, TABLE_FULL } from '../../services/UserSettingsProvider';
import { generateURI } from '../../config';
import { toast } from '../../../../utils/toast';
import LayersControl from './components/LayersControl';

import './styles.scss';

const CUSTOM_LAYER_WEIGHT = 850;
const isTrueFeatureID = id => ![undefined, ACTION_CREATE].includes(id);

export class MapPlayground extends React.Component {
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
    tableSize: PropTypes.string,
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
    map: undefined,
    settings: undefined,
    settingsEndpoint: undefined,
    tableSize: TABLE_MEDIUM,
    feature: {},
    backgroundStyle: [],
  }

  state = {
    mapConfig: undefined,
    interactions: [],
    sources: [],
    layers: [],
    refreshingLayers: false,
  }

  componentDidMount () {
    const {
      getSettings,
      settingsEndpoint,
      settings,
      map,
      match: { params: { layer } },
    } = this.props;

    if (settings) {
      this.setMapConfig();
    } else {
      getSettings(settingsEndpoint);
    }

    if (map && layer) {
      this.generateLayersToMap();
      this.setInteractions();
    }
  }

  componentDidUpdate ({
    map: prevMap,
    settings: prevSettings,
    match: { params: { layer: prevLayer, id: prevId } },
    feature: { geom: { coordinates: prevCoordinates } = {} },
    tableSize: prevTableSize,
  }) {
    const {
      settings,
      match: { params: { layer, id } },
      map,
      feature: { geom: { coordinates } = {} },
      tableSize,
    } = this.props;

    const { layers, addHighlight, removeHighlight } = this.state;

    if (settings !== prevSettings) {
      this.setMapConfig();
    }

    if (settings !== prevSettings || layer !== prevLayer || prevId !== id) {
      this.setInteractions();
    }

    if ((layer !== prevLayer || map !== prevMap || prevId !== id) && map) {
      this.generateLayersToMap();
    }

    if (layer && (layer !== prevLayer || map !== prevMap)) {
      this.setFitBounds();
    }

    if (tableSize !== prevTableSize && tableSize !== TABLE_FULL) {
      this.setFitBounds();
    }

    if (isTrueFeatureID(id) && JSON.stringify(prevCoordinates) !== JSON.stringify(coordinates)) {
      this.setFitBounds();
      this.generateLayersToMap();
      const { id: layerId, source } = layers.find(({ 'source-layer': sourceLayer }) => sourceLayer === layer) || {};
      if (!layerId || !map) {
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

    if (isTrueFeatureID(prevId) && !id) {
      const { id: layerId } = layers.find(({ 'source-layer': sourceLayer }) => sourceLayer === prevLayer) || {};
      if (!layerId || !map) {
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
      match: { params: { layer, id } },
      history: { push },
      displayViewFeature,
      settings,
    } = this.props;

    const { layer: { id: layerId } = {} } = getView(settings, layer);

    if (!layerId) {
      return;
    }

    const layers = getLayers(settings);

    const interactions = layers.map(interaction => {
      if (interaction.source !== `${layerId}`) {
        return false;
      }
      return {
        ...interaction,
        interaction: INTERACTION_FN,
        fn: ({
          feature: { sourceLayer, properties: { _id: propId } },
        }) => {
          if (interaction.main && displayViewFeature && !id) {
            push(generateURI('layer', { layer: sourceLayer, id: propId }));
          }
        },
      };
    }).filter(Boolean);

    this.setState({
      interactions,
    });
  }

  setFitBounds = () => {
    const {
      map,
      match: { params: { layer, id } },
      settings,
      feature: { geom: { coordinates = [] } = {} },
      setFitBounds,
    } = this.props;

    if (!map) return;

    const { extent: [w, s, e, n] } = getView(settings, layer);
    const coords = isTrueFeatureID(id) ? coordinates : [[w, s], [e, n]];

    if (!coords.length) return;

    setFitBounds({
      coordinates: id ? coordinates : [[w, s], [e, n]],
      hasDetails: !!id,
    });
  }

  setMapConfig () {
    const {
      settings,
      backgroundStyle,
    } = this.props;

    if (!settings) {
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

  interactiveMapInit = ({ addHighlight, removeHighlight }) => {
    this.setState({
      addHighlight,
      removeHighlight,
    });
  }

  displayCurrentLayer = () => {
    const {
      map,
      settings,
      match: { params: { layer, id } },
      feature: { geometries = {} } = {},
    } = this.props;

    const view = getView(settings, layer);

    const { layers } = this.state;
    if (!map || !layers.length) {
      return;
    }

    const geometriesIdentifiers = Object.values(geometries)
      .map(({ identifier }) => identifier)
      .filter(Boolean);

    layers.forEach(layerItem => {
      if (!map.getLayer(layerItem.id)) return;
      const conditionalDisplay = layerItem.source === `${view.layer.id}` && (isTrueFeatureID(id) || layerItem.main === true);
      map.setLayoutProperty(layerItem.id, 'visibility', conditionalDisplay ? 'visible' : 'none');
      if (geometriesIdentifiers.length && isTrueFeatureID(id) && layerItem.main === false) {
        map.setFilter(layerItem.id, ['in', '_id', ...geometriesIdentifiers]);
      }
    });
  }

  onChangeDisplayOfLayers = (layerId, display) => {
    this.setState(({ layers }) => ({
      layers: layers.map(layer => (
        layer.id === layerId
          ? { ...layer, displayOnMap: display }
          : layer
      )),
    }));
  }

  handleDisplayOfLayers = () => {
    const {
      addControl,
      removeControl,
      settings,
      match: { params: { layer, id } },
      t,
    } = this.props;

    const view = getView(settings, layer);
    const { layers } = this.state;

    if (!isTrueFeatureID(id)) {
      removeControl(CONTROL_CUSTOM);
    } else {
      addControl({
        control: CONTROL_CUSTOM,
        position: CONTROLS_TOP_LEFT,
        instance: LayersControl,
        layers: layers.filter(({ source, main }) => source === `${view.layer.id}` && !main),
        translate: t,
        onChange: this.onChangeDisplayOfLayers,
        order: 1,
      });
    }
  }

  refreshLayers = () => {
    this.displayCurrentLayer();
    this.setState(({ refreshingLayers }) => ({ refreshingLayers: !refreshingLayers }));
  }

  onTableHoverCell = (featureId, hover = true) => {
    const { map, match: { params: { layer } } } = this.props;
    const { layers, addHighlight, removeHighlight } = this.state;
    const { id: layerId, source } = layers.find(({ 'source-layer': sourceLayer }) => sourceLayer === layer) || {};
    if (!layerId || !map) {
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
    const {
      map,
      settings,
      match: { params: { layer } },
    } = this.props;

    const view = getView(settings, layer);

    if (!settings || !layer || !view) {
      return;
    }

    const {
      layer: { id: layerId },
      pictogram,
    } = getView(settings, layer);

    this.setState(({ sources: prevSources, layers: prevLayers }) => {
      if (prevSources.find(({ id }) => id === `${layerId}`) && prevLayers.filter(({ source }) => source === `${layerId}`)) {
        return null;
      }

      const sourcesFromSettings = getSources(settings);
      const layersFromSettings = getLayers(settings);

      const nextSource = sourcesFromSettings.find(({ id }) => id === `${layerId}`);
      const nextLayers = layersFromSettings
        .filter(({ source }) => source === `${layerId}`)
        .reverse()
        .map(nextLayer => ({ ...nextLayer, displayOnMap: true, weight: CUSTOM_LAYER_WEIGHT }));

      nextLayers.forEach(({ layout: { 'icon-image': iconImage } = {} }) => {
        if (iconImage) {
          map.loadImage(pictogram, (error, image) => {
            if (error) throw error;
            map.addImage(iconImage, image);
          });
        }
      });

      return {
        sources: [...prevSources, nextSource],
        layers: [...prevLayers, ...nextLayers],
      };
    }, () => {
      this.displayCurrentLayer();
      this.handleDisplayOfLayers();
    });
  }

  render () {
    const {
      layers,
      sources,
      interactions,
      mapConfig,
      refreshingLayers,
    } = this.state;
    const {
      controls,
      dataTableRef,
      detailsRef,
      settings,
      match: { params: { layer, id } },
      backgroundStyle,
      t,
      tableSize,
      errors,
      i18n: {
        getResourceBundle,
        language,
        store: { options: { fallbackLng } },
      },
    } = this.props;

    if (errors.settings) {
      return (
        <Message intent="danger" className="CRUD-no-settings">
          {t('CRUD.settings.unableToLoad')}
        </Message>
      );
    }

    const areSettingsLoaded = settings && mapConfig;

    if (!areSettingsLoaded) {
      return <Loading spinner />;
    }

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

    const areDetailsVisible = !!id;
    const layersToMap = layers.map(({ displayOnMap, main, ...props }) => props);

    const {
      terralego: { map: mapLocale },
    } = getResourceBundle(language.slice(0, 2)) || getResourceBundle(fallbackLng[0]);

    return (
      <>
        <DetailsWrapper detailsRef={detailsRef}>
          {areDetailsVisible && (
            <Details
              refreshingLayers={refreshingLayers}
            />
          )}
        </DetailsWrapper>

        <div
          className={classnames(
            {
              'CRUD-map': true,
              [`CRUD-map--with-table-${tableSize}`]: layer && !areDetailsVisible,
            },
          )}
        >
          {!!backgroundStyle.length && (
            <InteractiveMap
              onMapLoaded={this.resetMap}
              {...mapConfig}
              customStyle={{ layers: layersToMap, sources }}
              interactions={interactions}
              controls={controls}
              onInit={this.interactiveMapInit}
              onStyleChange={this.refreshLayers}
              translate={t}
              locale={mapLocale}
            />
          )}
          {!backgroundStyle.length && (
            <Message intent="danger" className="CRUD-no-map">
              {t('CRUD.settings.unableToLoadMap')}
            </Message>
          )}
        </div>

        <div
          ref={dataTableRef}
          className={classnames(
            {
              'CRUD-table': true,
              'CRUD-table--active': layer && !areDetailsVisible,
              [`CRUD-table--${tableSize}`]: layer && !areDetailsVisible,
            },
          )}
          onTransitionEnd={this.setFitBounds}
        >
          <DataTable
            layerName={layer}
            onHoverCell={this.onTableHoverCell}
          />
        </div>
      </>
    );
  }
}

export default MapPlayground;