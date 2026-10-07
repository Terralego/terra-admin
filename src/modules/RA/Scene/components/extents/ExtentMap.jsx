import React, { useCallback, useEffect, useRef, useState } from 'react';

import getBboxPolygon from '@turf/bbox-polygon';

import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import HomeIcon from '@material-ui/icons/Home';
import { makeStyles } from '@material-ui/core/styles';

import useAppSettings from '../../../../../hooks/useAppSettings';
import useBboxDraw from '../../../../../components/Map/useBboxDraw';
import useMaplibreMap from '../../../../../components/Map/useMaplibreMap';
import { isSameBbox, isValidBbox } from './utils';

const PREVIEW_SOURCE = 'extent-preview';

const useStyles = makeStyles({
  root: {
    position: 'relative',
    height:   300,
    width:    '100%',
  },
  map: {
    height: '100%',
    width:  '100%',
  },
  control: {
    position:        'absolute',
    left:            10,
    backgroundColor: 'white',
  },
  clear: { top: 10 },
  reset: { top: 50 },
});

const showPreview = (map, bbox) => {
  const data = isValidBbox(bbox)
    ? getBboxPolygon(bbox)
    : { type: 'FeatureCollection', features: [] };

  const source = map.getSource(PREVIEW_SOURCE);
  if (source) {
    source.setData(data);
    return;
  }

  map.addSource(PREVIEW_SOURCE, { type: 'geojson', data });
  map.addLayer({
    id:     `${PREVIEW_SOURCE}-fill`,
    type:   'fill',
    source: PREVIEW_SOURCE,
    paint:  { 'fill-color': '#3bb2d0', 'fill-opacity': 0.15 },
  });
  map.addLayer({
    id:     `${PREVIEW_SOURCE}-line`,
    type:   'line',
    source: PREVIEW_SOURCE,
    paint:  { 'line-color': '#3bb2d0', 'line-width': 2 },
  });
};

const ExtentMap = ({ bbox, readOnly, onChange }) => {
  const classes = useStyles();
  const { map: mapConfig } = useAppSettings() || {};
  const [map, setMap] = useState(null);

  // Dernière emprise dessinée sur la carte, pour ne pas redessiner celle que
  // l'utilisateur vient de tracer quand elle revient par `bbox`
  const drawnBboxRef = useRef(null);

  const handleDraw = useCallback(newBbox => {
    const value = newBbox || [];
    drawnBboxRef.current = value;
    onChange(value);
  }, [onChange]);

  const { attach, setBbox, clear } = useBboxDraw({ onChange: handleDraw });

  const handleReady = useCallback(loadedMap => {
    if (!readOnly) {
      attach(loadedMap);
    }
    setMap(loadedMap);
  }, [attach, readOnly]);

  const { containerRef } = useMaplibreMap({
    center:     mapConfig?.center,
    zoom:       mapConfig?.zoom,
    navigation: !readOnly,
    onReady:    handleReady,
  });

  useEffect(() => {
    if (!map) {
      return;
    }

    if (readOnly) {
      showPreview(map, bbox);
    } else {
      if (isSameBbox(drawnBboxRef.current, bbox)) {
        return;
      }
      setBbox(isValidBbox(bbox) ? bbox : null);
      drawnBboxRef.current = bbox;
    }

    if (isValidBbox(bbox)) {
      map.fitBounds(bbox, { padding: 20, duration: 0 });
    }
  }, [map, bbox, readOnly, setBbox]);

  const resetExtent = useCallback(() => {
    if (!map || !mapConfig) {
      return;
    }
    map.setCenter(mapConfig.center);
    map.setZoom(mapConfig.zoom);
  }, [map, mapConfig]);

  return (
    <div className={classes.root}>
      <div ref={containerRef} className={classes.map} />
      {!readOnly && (
        <>
          <IconButton
            className={`${classes.control} ${classes.clear} maplibregl-ctrl-group`}
            size="small"
            onClick={clear}
          >
            <DeleteIcon />
          </IconButton>
          <IconButton
            className={`${classes.control} ${classes.reset} maplibregl-ctrl-group`}
            size="small"
            onClick={resetExtent}
          >
            <HomeIcon />
          </IconButton>
        </>
      )}
    </div>
  );
};

export default ExtentMap;
