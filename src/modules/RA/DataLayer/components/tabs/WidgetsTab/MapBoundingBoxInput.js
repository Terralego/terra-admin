import MapboxDraw from '@mapbox/mapbox-gl-draw';
import getBbox from '@turf/bbox';
import getBboxPolygon from '@turf/bbox-polygon';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTranslate } from 'react-admin';
import { useField } from 'react-final-form';
import ReactMapboxGl from 'react-mapbox-gl';
import DrawControl from 'react-mapbox-gl-draw';

import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import HomeIcon from '@material-ui/icons/Home';

import DrawRectangle from '../../../../../../components/DrawRectangle';
import useAppSettings from '../../../../../../hooks/useAppSettings';

import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

const MAPBOX_STYLE = 'mapbox://styles/mapbox/streets-v9';

const Map = ({ accessToken, ...rest }) => {
  const MapComponent = useMemo(
    () => ReactMapboxGl({ accessToken }),
    [accessToken],
  );
  return <MapComponent {...rest} />;
};

const MapBoundingBoxInput = ({ field }) => {
  const [loaded, setLoaded] = useState(false);
  const {
    input: { value: boundingBox, onChange },
  } = useField(field);

  const mapRef = useRef(null);
  const drawRef = useRef(null);
  const translate = useTranslate();
  const { map: mapConfig } = useAppSettings();

  useEffect(() => {
    if (mapConfig?.accessToken) {
      setLoaded(true);
    }
  }, [mapConfig]);


  const loadBbox = useCallback(
    map => {
      mapRef.current = map;
      if (!map) return;
      const { draw } = drawRef.current;

      if (boundingBox.length > 0) {
        map.fitBounds(boundingBox, { padding: 20 });
        const rectangle = getBboxPolygon(boundingBox.flat());
        draw.add(rectangle);
      } else if (mapConfig?.bounds) {
        const mapConfigBbox = [
          [mapConfig.bounds.minLon, mapConfig.bounds.maxLat],
          [mapConfig.bounds.maxLon, mapConfig.bounds.MinLat],
        ];
        try {
          map.fitBounds(mapConfigBbox, { padding: 20 });
          const rectangle = getBboxPolygon(mapConfigBbox.flat());
          draw.add(rectangle);
          onChange(mapConfigBbox);
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error(e);
        }
      }
    },
    [boundingBox, mapConfig, onChange],
  );

  const updateBbox = useCallback(
    ({ features, type }) => {
      if (type === 'draw.create') {
        const { draw } = drawRef.current;
        const [feature] = features;
        const turfbbox = getBbox(feature);
        const bbox = [
          [turfbbox[0], turfbbox[3]],
          [turfbbox[2], turfbbox[1]],
        ];

        const { features: allfeatures } = draw.getAll();
        const featuresToDelete = allfeatures.reduce((toDelete, f) => {
          if (f.id === feature.id) {
            return toDelete;
          }
          return [...toDelete, f.id];
        }, []);
        draw.delete(featuresToDelete);
        onChange(bbox);
      } else if (type === 'draw.delete') {
        onChange(null);
      }
    },
    [onChange],
  );

  const deleteAll = useCallback(() => {
    // clear drawing on map
    const { draw } = drawRef.current;
    const { features } = draw.getAll();
    const ids = features.map(f => f.id);

    // force 'rectangle_mode' to be able to instantly draw after 'deleteAll'
    // (for some obscur reason)
    draw.deleteAll(ids).changeMode('draw_rectangle');

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
      <Typography variant="body1">
        {translate('resources.datalayer.widgets-editor.bounding-box-editor-title')}
      </Typography>
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

export default MapBoundingBoxInput;
