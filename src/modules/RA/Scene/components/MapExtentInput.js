import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useField, useForm } from 'react-final-form';
import { useTranslate } from 'react-admin';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import ReactMapboxGl from 'react-mapbox-gl';
import DrawControl from 'react-mapbox-gl-draw';
import getBbox from '@turf/bbox';
import getBboxPolygon from '@turf/bbox-polygon';

import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import HomeIcon from '@material-ui/icons/Home';

import DrawRectangle from '../../../../components/DrawRectangle';
import useAppSettings from '../../../../hooks/useAppSettings';

import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

const MAPBOX_STYLE = 'mapbox://styles/mapbox/streets-v9';

const Map = ({ accessToken, ...rest }) => {
  const MapComponent = useMemo(() => ReactMapboxGl({ accessToken }), [accessToken]);
  return <MapComponent {...rest} />;
};

const MapInput = () => {
  const [loaded, setLoaded] = useState(false);
  const { input: { value: mapSettings } } = useField('config.map_settings');

  const form = useForm();
  const mapRef = useRef(null);
  const drawRef = useRef(null);
  const translate = useTranslate();
  const { map: mapConfig } = useAppSettings();

  useEffect(() => {
    if (mapConfig?.accessToken) {
      setLoaded(true);
    }
  }, [mapConfig]);

  const loadBbox = useCallback(map => {
    mapRef.current = map;
    const { draw } = drawRef.current;

    const { fitBounds: { coordinates = [] } = {} } = mapSettings;
    if (coordinates.length > 0) {
      map.fitBounds(coordinates, { padding: 20 });
      const rectangle = getBboxPolygon(coordinates);
      draw.add(rectangle);
    }
  }, [mapSettings]);

  const updateBbox = useCallback(({ features, type }) => {
    const { draw } = drawRef.current;
    const {
      values: {
        config: { map_settings: settings = {} } = {},
        config,
      },
    } = form.getState();

    const fitBounds = {};

    if (type === 'draw.create') {
      const [feature] = features;
      const bbox = getBbox(feature);
      fitBounds.coordinates = bbox;

      const { features: allfeatures } = draw.getAll();
      const featuresToDelete = allfeatures.reduce((toDelete, f) => {
        if (f.id === feature.id) {
          return toDelete;
        }
        return [...toDelete, f.id];
      }, []);
      draw.delete(featuresToDelete);
    }

    form.change('config', {
      ...config,
      map_settings: {
        ...settings,
        fitBounds,
      },
    });
  }, [form]);

  const deleteAll = useCallback(() => {
    // clear drawing on map
    const { draw } = drawRef.current;
    const { features } = draw.getAll();
    const ids = features.map(f => f.id);
    draw.deleteAll(ids);

    // clear form
    updateBbox({ type: 'draw.delete' });
  }, [updateBbox]);

  const resetExtent = useCallback(() => {
    const { current: map } = mapRef;
    map.setCenter(mapConfig.center);
    map.setZoom(mapConfig.zoom);
  }, [mapConfig.center, mapConfig.zoom]);

  if (!loaded) {
    return null;
  }


  const modes = { ...MapboxDraw.modes, draw_rectangle: DrawRectangle };

  return (
    <div id="mapInput">
      <Typography variant="body1">{translate('view.form.extent-label')}</Typography>
      <Map
        accessToken={mapConfig.accessToken}
        style={MAPBOX_STYLE} // eslint-disable-line react/style-prop-object
        containerStyle={{ height: '300px', width: '600px' }}
        center={mapConfig.center}
        zoom={[mapConfig.zoom]}
        onStyleLoad={loadBbox}
      >
        <DrawControl
          ref={drawRef}
          modes={modes}
          displayControlsDefault={false}
          onDrawCreate={updateBbox}
          onDrawDelete={updateBbox}
          defaultMode="draw_rectangle"
        />
        <IconButton
          variant="contained"
          className="mapboxgl-ctrl-group"
          size="small"
          style={{
            position: 'absolute',
            marginTop: '10px',
            marginLeft: '10px',
            backgroundColor: 'white',

          }}
          onClick={deleteAll}
        >
          <DeleteIcon />
        </IconButton>
        <IconButton
          variant="contained"
          className="mapboxgl-ctrl-group"
          size="small"
          style={{
            position: 'absolute',
            marginTop: '50px',
            marginLeft: '10px',
            backgroundColor: 'white',

          }}
          onClick={resetExtent}
        >
          <HomeIcon />
        </IconButton>
      </Map>
    </div>
  );
};

export default MapInput;
