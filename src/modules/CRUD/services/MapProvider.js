import React, { useState, useCallback, useRef } from 'react';
import connect from 'react-ctx-connect';

import {
  DEFAULT_CONTROLS,
  CONTROL_CAPTURE,
  CONTROL_BACKGROUND_STYLES,
  CONTROLS_TOP_RIGHT,
} from '@terralego/core/modules/Map';

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

  const addControl = useCallback(controlToAdd => {
    if (!controlToAdd) return;
    setControls(prevControls => {
      if (prevControls.some(({ control }) => control === controlToAdd.control)) {
        return prevControls.map(control => (
          (control.control === controlToAdd.control)
            ? controlToAdd
            : control
        ));
      }
      return [controlToAdd, ...prevControls].sort(sortByOrder);
    });
  }, []);

  const removeControl = useCallback(controlToRemove => {
    if (!controlToRemove) return;
    setControls(prevControls => prevControls.filter(item => item.control !== controlToRemove));
  }, []);

  const value = {
    addControl,
    controls,
    detailsRef,
    dataTableRef,
    map,
    setControls,
    setMap,
    removeControl,
  };

  return (
    <Provider value={value}>
      {children}
    </Provider>
  );
};

export default MapProvider;
