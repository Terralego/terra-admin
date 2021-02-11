import React, { useState, useCallback, useRef } from 'react';
import connect from 'react-ctx-connect';

import {
  DEFAULT_CONTROLS,
  CONTROL_CAPTURE,
  CONTROL_BACKGROUND_STYLES,
  CONTROLS_TOP_RIGHT,
} from '@terralego/core/modules/Map';

import { getBounds } from './features';

const CONTROL_LIST = [{
  control: CONTROL_BACKGROUND_STYLES,
  position: CONTROLS_TOP_RIGHT,
}, {
  control: CONTROL_CAPTURE,
  position: CONTROLS_TOP_RIGHT,
}];

const sortByOrder = ({ order: a = 0 }, { order: b = 0 }) => a - b;

export const MapContext = React.createContext({});
export const connectMapProvider = connect(MapContext);

const { Provider } = MapContext;

export const MapProvider = ({ children }) => {
  const detailsRef = useRef(null);
  const dataTableRef = useRef(null);

  const [controls, setControls] = useState([...DEFAULT_CONTROLS, ...CONTROL_LIST]);
  const [map, setMap] = useState(null);
  const [interactiveMapProps, setInteractiveMapProps] = useState(undefined);
  const [layers, setLayers] = useState([]);

  const addControl = useCallback(controlToAdd => {
    if (!controlToAdd) return;
    setControls(prevControls => {
      if (prevControls.some(({ control }) => control === controlToAdd.control)) {
        return prevControls;
      }
      return [controlToAdd, ...prevControls].sort(sortByOrder);
    });
  }, []);

  const removeControl = useCallback(controlToRemove => {
    if (!controlToRemove) return;
    setControls(prevControls => {
      if (prevControls.some(({ control }) => control === controlToRemove)) {
        return prevControls.filter(({ control }) => control !== controlToRemove);
      }
      return prevControls;
    });
  }, []);

  const featureToHighlight = useCallback(({ featureId, layer, hover }) => {
    const { id: layerId, source } = layers.find(({ 'source-layer': sourceLayer }) => sourceLayer === layer) || {};
    if (!map || !featureId || !layerId) {
      return;
    }
    const { addHighlight, removeHighlight } = interactiveMapProps;
    if (hover) {
      addHighlight && addHighlight({
        layerId,
        featureId,
        highlightColor: 'red',
        unique: true,
        source,
      });
    } else {
      removeHighlight && removeHighlight({
        layerId,
        featureId,
      });
    }
  }, [interactiveMapProps, layers, map]);


  const setFitBounds = useCallback(({ coordinates, hasDetails }) => {
    if (!coordinates.length) return;

    const { current: detail } = detailsRef;
    const { current: dataTable } = dataTableRef;

    const padding = {
      top: 20,
      right: hasDetails ? (detail?.offsetWidth ?? 0 + 50) : 50,
      bottom: !hasDetails ? (dataTable?.offsetHeight ?? 0 + 20) : 20,
      left: 20,
    };
    map.resize();
    map.fitBounds(getBounds(coordinates), { padding, duration: 0 });
  }, [dataTableRef, detailsRef, map]);

  const value = {
    addControl,
    controls,
    detailsRef,
    dataTableRef,
    featureToHighlight,
    layers,
    interactiveMapProps,
    map,
    setControls,
    setFitBounds,
    setMap,
    setLayers,
    setInteractiveMapProps,
    removeControl,
  };

  return (
    <Provider value={value}>
      {children}
    </Provider>
  );
};

export default MapProvider;
