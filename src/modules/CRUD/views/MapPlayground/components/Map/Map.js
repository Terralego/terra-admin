import React, { useState, useContext, useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useParams, useHistory } from 'react-router-dom';

import InteractiveMap, { INTERACTION_FN } from '@terralego/core/modules/Map/InteractiveMap';
import {
  CONTROL_CUSTOM,
  CONTROLS_TOP_LEFT,
} from '@terralego/core/modules/Map';

import { ACTION_CREATE, getLayers, getSources, getView } from '../../../../services/CRUD';
import { CRUDContext } from '../../../../services/CRUDProvider';
import { MapContext } from '../../../../services/MapProvider';

import { generateURI } from '../../../../config';
import Message from '../../../../../../components/Message';
import LayersControl from '../LayersControl';
import { usePrevious } from '../../../../../../utils/hooks';

const CUSTOM_LAYER_WEIGHT = 850;

const Map = ({ displayViewFeature, settings, triggerFitBound }) => {
  const [interactions, setInteractions] = useState(null);
  const [sources, setSources] = useState([]);

  const {
    feature,
  } = useContext(CRUDContext);

  const {
    addControl,
    controls,
    map,
    layers,
    removeControl,
    setFitBounds,
    setLayers,
    setMap,
    setInteractiveMapProps,
  } = useContext(MapContext);

  const { id, layer } = useParams();

  const { push } = useHistory();

  const prevId = usePrevious(id);

  const {
    i18n: {
      getResourceBundle,
      language,
      store: { options: { fallbackLng } },
    },
    t,
  } = useTranslation();

  const view = useMemo(() => getView(settings, layer), [layer, settings]);

  const backgroundStyle = useMemo(() => settings?.config?.BASE_LAYERS?.map(style => {
    const [label] = Object.keys(style);
    return {
      label,
      url: style[label].url,
    };
  }), [settings]);

  const mapConfig = useMemo(() => {
    if (!settings) {
      return null;
    }

    const config = settings?.config?.default.map;

    config.accessToken = config.mapbox_access_token;
    config.backgroundStyle = backgroundStyle;

    delete config.mapbox_access_token;

    return config;
  }, [backgroundStyle, settings]);

  const isFeatureID = useMemo(() => ![undefined, ACTION_CREATE].includes(id), [id]);

  const displayCurrentLayer = useCallback(() => {
    const {
      feature: { geometries = {} } = {},
    } = feature[id] || {};

    if (!map || !layers.length) {
      return;
    }

    const geometriesIdentifiers = Object.values(geometries)
      .map(({ identifier }) => identifier)
      .filter(Boolean);

    layers.forEach(layerItem => {
      if (!map.getLayer(layerItem.id)) return;
      const conditionalDisplay = layerItem.source === `${view.layer.id}` && (isFeatureID || layerItem.main);
      map.setLayoutProperty(layerItem.id, 'visibility', conditionalDisplay ? 'visible' : 'none');
      if (geometriesIdentifiers.length && isFeatureID && !layerItem.main) {
        map.setFilter(layerItem.id, ['in', '_id', ...geometriesIdentifiers]);
      }
    });
  }, [feature, id, isFeatureID, layers, map, view]);

  useEffect(() => {
    if (!view || id) {
      setInteractions([]);
      return;
    }

    if (!displayViewFeature) {
      return;
    }

    const { layer: { id: layerId } = {} } = view;

    if (!layerId) {
      return;
    }

    const layersPaints = getLayers(settings);

    const nextInteractions = layersPaints
      .filter(({ source, main }) => source === `${layerId}` && main)
      .map(interaction => ({
        ...interaction,
        interaction: INTERACTION_FN,
        fn: ({
          feature: { sourceLayer, properties: { _id: propId } },
        }) => {
          push(generateURI('layer', { layer: sourceLayer, id: propId }));
        },
      }));

    setInteractions(nextInteractions);
  }, [displayViewFeature, id, push, settings, view]);

  useEffect(() => {
    if (!settings || !layer || !view || !map) {
      return;
    }

    const {
      layer: { id: layerId },
      pictogram,
    } = view;

    if (sources.find(source => source.id === `${layerId}`) && layers.filter(({ source }) => source === `${layerId}`)) {
      displayCurrentLayer();
      return;
    }

    const nextSource =  getSources(settings).find(source => source.id === `${layerId}`);
    setSources(prevSources => [...prevSources, nextSource]);

    const nextLayers = getLayers(settings)
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

    setLayers(prevLayers => [...prevLayers, ...nextLayers]);

    displayCurrentLayer();
  }, [displayCurrentLayer, layer, layers, map, setLayers, settings, sources, view]);

  const onFitBounds = useCallback(() => {
    if (!map || !view) {
      return;
    }

    if (!id && prevId) {
      return;
    }

    const { geom: { coordinates = [] } = {} } = feature[id] || {};
    const { extent: [w, s, e, n] } = view;

    setFitBounds({
      coordinates: isFeatureID ? coordinates : [[w, s], [e, n]],
      hasDetails: !!id,
    });

    // Exclude `prevId` from dependencies
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feature, id, isFeatureID, map, setFitBounds, view]);

  useEffect(() => {
    onFitBounds();
  }, [onFitBounds, triggerFitBound]);


  const onMapLoaded = useCallback(nextMap => {
    setMap(nextMap);
  }, [setMap]);

  const onInit = useCallback(props => {
    setInteractiveMapProps(props);
  }, [setInteractiveMapProps]);


  const onChangeDisplayOfLayers = useCallback((layerId, display) => {
    setLayers(prevLayers => (
      prevLayers.map(item => (
        item.id === layerId
          ? { ...item, displayOnMap: display }
          : item
      ))
    ));
  }, [setLayers]);

  useEffect(() => {
    if (!view || !map) {
      return;
    }
    if (!isFeatureID) {
      removeControl(CONTROL_CUSTOM);
    } else {
      const layersProps = layers.filter(({ source, main }) => source === `${view.layer.id}` && !main);
      addControl({
        control: CONTROL_CUSTOM,
        position: CONTROLS_TOP_LEFT,
        instance: LayersControl,
        layers: layersProps,
        onChange: onChangeDisplayOfLayers,
        order: 1,
        translate: t,
      });
    }
  }, [addControl, isFeatureID, layers, map, onChangeDisplayOfLayers, removeControl, t, view]);

  const {
    terralego: { map: mapLocale },
  } = useMemo(() => (
    getResourceBundle(language.slice(0, 2)) || getResourceBundle(fallbackLng[0])
  ), [fallbackLng, getResourceBundle, language]);

  if ([mapConfig, interactions].includes(null)) {
    return null;
  }

  if (!backgroundStyle.length) {
    return (
      <Message intent="danger" className="CRUD-no-map">
        {t('CRUD.settings.unableToLoadMap')}
      </Message>
    );
  }

  return (
    <InteractiveMap
      {...mapConfig}
      controls={controls}
      customStyle={{ layers, sources }}
      interactions={interactions}
      onInit={onInit}
      onMapLoaded={onMapLoaded}
      onStyleChange={displayCurrentLayer}
      locale={mapLocale}
      translate={t}
    />
  );
};

Map.propTypes = {
  displayViewFeature: PropTypes.bool,
  settings: PropTypes.shape({}),
  triggerFitBound: PropTypes.string,
};

Map.defaultProps = {
  displayViewFeature: true,
  settings: undefined,
  triggerFitBound: undefined,
};

export default Map;
