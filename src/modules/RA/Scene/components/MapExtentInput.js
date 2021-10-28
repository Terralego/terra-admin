import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
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

import useAppSettings from '../../../../hooks/useAppSettings';

import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

const MAPBOX_STYLE = 'mapbox://styles/mapbox/streets-v9';

const Map = ({ accessToken, ...rest }) => {
  const MapComponent = useMemo(() => ReactMapboxGl({ accessToken }), [accessToken]);
  return <MapComponent {...rest} />;
};

const MapInput = () => {
  const [loaded, setLoaded] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const { input: { value: mapSettings } } = useField('config.map_settings');

  const form = useForm();
  const drawRef = useRef(null);
  const translate = useTranslate();
  const { map: mapConfig } = useAppSettings();

  useEffect(() => {
    if (mapConfig?.accessToken) {
      setLoaded(true);
    }
  }, [mapConfig]);

  const loadBbox = useCallback(map => {
    const { draw } = drawRef.current;
    const { fitBounds: { coordinates = [] } = {} } = mapSettings;
    if (coordinates.length > 0) {
      map.fitBounds(coordinates, { padding: 20 });
      const rectangle = getBboxPolygon(coordinates);
      draw.add(rectangle);
    }
  }, [mapSettings]);

  const updateBbox = useCallback(({ features, type }) => {
    const {
      values: {
        config: { map_settings: settings = {} } = {},
        config,
      },
    } = form.getState();

    const fitBounds = {};

    if (type === 'draw.create') {
      setDisabled(true);
      const [feature] = features;
      const bbox = getBbox(feature);
      fitBounds.coordinates = bbox;
    } else {
      setDisabled(false);
    }

    form.change('config', {
      ...config,
      map_settings: {
        ...settings,
        fitBounds,
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
          controls={{ trash: true }}
          onDrawCreate={updateBbox}
          onDrawDelete={updateBbox}
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
