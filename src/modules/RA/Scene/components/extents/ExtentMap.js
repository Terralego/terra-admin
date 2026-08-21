import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import MapboxDraw from '@mapbox/mapbox-gl-draw';
import getBbox from '@turf/bbox';
import getBboxPolygon from '@turf/bbox-polygon';
import { useGetList } from 'react-admin';
import ReactMapboxGl, { GeoJSONLayer } from 'react-mapbox-gl';
import DrawControl from 'react-mapbox-gl-draw';

import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import HomeIcon from '@material-ui/icons/Home';

import DrawRectangle from '../../../../../components/DrawRectangle';
import useAppSettings from '../../../../../hooks/useAppSettings';
import getBaseLayerStyle from '../../../../../utils/baseLayerStyle';
import { RES_BASELAYER } from '../../../ra-modules';
import { isSameBbox, isValidBbox } from './utils';

import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

const MAPBOX_STYLE = 'mapbox://styles/mapbox/streets-v9';

const controlStyle = top => ({
  position: 'absolute',
  marginTop: top,
  marginLeft: '10px',
  backgroundColor: 'white',
});

const Map = ({ accessToken, ...rest }) => {
  const MapComponent = useMemo(() => ReactMapboxGl({ accessToken }), [accessToken]);
  return <MapComponent {...rest} />;
};

const RECTANGLE_PAINT = {
  fill: { 'fill-color': '#3bb2d0', 'fill-opacity': 0.15 },
  line: { 'line-color': '#3bb2d0', 'line-width': 2 },
};

const ExtentMap = ({ bbox, readOnly, onChange }) => {
  const mapRef = useRef(null);
  const drawRef = useRef(null);
  const drawnBboxRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const { map: mapConfig } = useAppSettings() || {};

  const zoom = useMemo(() => [mapConfig?.zoom], [mapConfig]);

  const {
    data: baseLayers = {},
    ids: baseLayerIds = [],
  } = useGetList(RES_BASELAYER, { page: 1, perPage: 1 }, { field: 'order', order: 'ASC' });

  const style = useMemo(
    () => (mapConfig?.accessToken
      ? MAPBOX_STYLE
      : getBaseLayerStyle(baseLayers[baseLayerIds[0]])),
    [baseLayers, baseLayerIds, mapConfig],
  );

  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const onStyleLoad = useCallback(map => {
    mapRef.current = map;
    setLoaded(true);
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (readOnly) {
      if (loaded && map && isValidBbox(bbox)) map.fitBounds(bbox, { padding: 20, duration: 0 });
      return;
    }

    const { draw } = drawRef.current || {};
    if (!loaded || !draw || !map) return;
    if (isSameBbox(drawnBboxRef.current, bbox)) return;

    draw.deleteAll();
    if (isValidBbox(bbox)) {
      draw.add(getBboxPolygon(bbox));
      map.fitBounds(bbox, { padding: 20, duration: 0 });
    } else {
      draw.changeMode('draw_rectangle');
    }
    drawnBboxRef.current = bbox;
  }, [bbox, loaded, readOnly]);

  const updateBbox = useCallback(({ features, type }) => {
    const { draw } = drawRef.current;

    if (type === 'draw.create') {
      const [feature] = features;

      const { features: allFeatures } = draw.getAll();
      draw.delete(allFeatures.filter(({ id }) => id !== feature.id).map(({ id }) => id));

      const newBbox = getBbox(feature);
      drawnBboxRef.current = newBbox;
      onChangeRef.current(newBbox);
      return;
    }

    drawnBboxRef.current = [];
    onChangeRef.current([]);
  }, []);

  const deleteAll = useCallback(() => {
    const { draw } = drawRef.current;

    draw.deleteAll().changeMode('draw_rectangle');

    updateBbox({ type: 'draw.delete' });
  }, [updateBbox]);

  const resetExtent = useCallback(() => {
    const { current: map } = mapRef;
    map.setCenter(mapConfig.center);
    map.setZoom(mapConfig.zoom);
  }, [mapConfig]);

  if (!mapConfig || !style) {
    return null;
  }

  const modes = { ...MapboxDraw.modes, draw_rectangle: DrawRectangle };

  return (
    <div id="mapInput">
      <Map
        accessToken={mapConfig.accessToken}
        style={style} // eslint-disable-line react/style-prop-object
        containerStyle={{ height: '300px', width: '100%' }}
        center={mapConfig.center}
        zoom={zoom}
        onStyleLoad={onStyleLoad}
      >
        {readOnly && isValidBbox(bbox) && (
          <GeoJSONLayer
            data={getBboxPolygon(bbox)}
            fillPaint={RECTANGLE_PAINT.fill}
            linePaint={RECTANGLE_PAINT.line}
          />
        )}
        {!readOnly && (
          <DrawControl
            ref={drawRef}
            modes={modes}
            displayControlsDefault={false}
            onDrawCreate={updateBbox}
            onDrawDelete={updateBbox}
            defaultMode="draw_rectangle"
          />
        )}
        {!readOnly && (
        <IconButton
          variant="contained"
          className="mapboxgl-ctrl-group"
          size="small"
          style={controlStyle('10px')}
          onClick={deleteAll}
        >
          <DeleteIcon />
        </IconButton>
        )}
        {!readOnly && (
          <IconButton
            variant="contained"
            className="mapboxgl-ctrl-group"
            size="small"
            style={controlStyle('50px')}
            onClick={resetExtent}
          >
            <HomeIcon />
          </IconButton>
        )}
      </Map>
    </div>
  );
};

export default ExtentMap;
