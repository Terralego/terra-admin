import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useField, useForm } from 'react-final-form';
import { useTranslate } from 'react-admin';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import ReactMapboxGl from 'react-mapbox-gl';
import DrawControl from 'react-mapbox-gl-draw';
import DrawRectangle from 'mapbox-gl-draw-rectangle-mode';
import getBbox from '@turf/bbox';
import getBboxPolygon from '@turf/bbox-polygon';

import IconButton from '@material-ui/core/IconButton';
import RectangleIcon from '@material-ui/icons/Crop169';
import Typography from '@material-ui/core/Typography';

import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

let Map = null;

const MapInput = ({ mapConfig }) => {
  const [loaded, setLoaded] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const { input: { value: mapSettings } } = useField('config.map_settings');

  const form = useForm();
  const mapRef = useRef(null);
  const drawRef = useRef(null);
  const translate = useTranslate();

  useEffect(() => {
    if (mapConfig.accessToken) {
      Map = ReactMapboxGl({ accessToken: mapConfig.accessToken });
      setLoaded(true);
    }
  }, [mapConfig.accessToken]);

  const loadBbox = useCallback(map => {
    const { draw } = drawRef.current;
    const { fitBounds: { coordinates = [] } = {} } = mapSettings;
    if (coordinates.length > 0) {
      map.fitBounds(coordinates, { padding: 20 });
      const rectangle = getBboxPolygon(coordinates);
      draw.add(rectangle);
    }
  }, [mapSettings]);

  const addBbox = useCallback(({ features }) => {
    setDisabled(true);
    const [feature] = features;
    const bbox = getBbox(feature);

    const {
      values: {
        config: { map_settings: settings = {} } = {},
        config,
      },
    } = form.getState();

    form.change('config', {
      ...config,
      map_settings: {
        ...settings,
        fitBounds: { coordinates: bbox },
      },
    });
  }, [form]);

  const removeBbox = useCallback(() => {
    setDisabled(false);

    const {
      values: {
        config: { map_settings: settings = {} } = {},
        config,
      },
    } = form.getState();

    form.change('config', {
      ...config,
      map_settings: {
        ...settings,
        fitBounds: {},
      },
    });
  }, [form]);


  if (!loaded) {
    return null;
  }

  const modes = { ...MapboxDraw.modes, draw_rectangle: DrawRectangle };

  const triggerRectangleMode = () => {
    const { draw } = drawRef.current;
    draw.changeMode('draw_rectangle');
  };

  return (
    <div id="mapInput">
      <Typography variant="body1">{translate('view.form.extent-label')}</Typography>
      <Map
        ref={mapRef}
        style="mapbox://styles/mapbox/streets-v9" // eslint-disable-line react/style-prop-object
        containerStyle={{ height: '300px', width: '600px' }}
        center={mapConfig.center}
        zoom={[mapConfig.zoom]}
        onStyleLoad={loadBbox}
      >
        <DrawControl
          ref={drawControl => { drawRef.current = drawControl; }}
          modes={modes}
          displayControlsDefault={false}
          controls={{ trash: true }}
          onDrawCreate={addBbox}
          onDrawDelete={removeBbox}
        />
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
          onClick={triggerRectangleMode}
          disabled={disabled}
        >
          <RectangleIcon />
        </IconButton>
      </Map>
    </div>
  );
};

export default MapInput;
