import { memo, useCallback, useEffect, useMemo, useContext } from 'react';
import { useTranslation } from 'react-i18next';

import {
  CONTROL_DRAW,
  CONTROL_PATH,
  CONTROLS_TOP_LEFT,
} from '@terralego/core/modules/Map';
import PropTypes from 'prop-types';
import { getCoordinatesFromGeometries, getDirectionsThemes, getLayerId } from './utils';

import { getLayers } from '../../../modules/CRUD/services/CRUD';

import { CRUDContext } from '../../../modules/CRUD/services/CRUDProvider';
import { MapContext } from '../../../modules/CRUD/services/MapProvider';

import {
  ALL,
  POINT,
  LINESTRING,
  POLYGON,
  MULTI_POINT,
  MULTI_LINESTRING,
  MULTI_POLYGON,
  geomTypeList,
} from '../../../utils/geom';

import './styles.scss';

const MapInteraction = ({
  geomValues,
  featuresToFitBounds,
  setFeaturesToFitBounds,
  setFormData,
}) => {
  const { t } = useTranslation();

  const { settings } = useContext(CRUDContext);

  const {
    addControl,
    map,
    removeControl,
    setFitBounds,
  } = useContext(MapContext);

  const layers = useMemo(() => getLayers(settings), [settings]);

  const resetStyle = useCallback(() => {
    map && map.setFilter(getLayerId(layers, geomValues.layerName), null);
  }, [geomValues.layerName, layers, map]);

  const updateGeometryFromMap = useCallback(
    ({ target, ...props }) => {
      if (target.pathControl) {
        const { geometry, properties } = target.pathControl.getLineString();
        setFormData({ geom: geometry, routingInformation: properties });
        return;
      }

      let { features } = target.draw.getAll();

      const isMultiGeometry = ![POINT, LINESTRING, POLYGON].includes(geomValues.geomType);
      if (features.length > 1 && !isMultiGeometry) {
        const { features: [{ id }] } = props;
        const { currentFeature, otherFeaturesIds } = features.reduce(
          (list, item) => {
            if (item.id === id) {
              list.currentFeature.push(item);
            } else {
              list.otherFeaturesIds.push(item.id);
            }
            return list;
          },
          { currentFeature: [], otherFeaturesIds: [] },
        );

        target.draw.delete(otherFeaturesIds);
        features = currentFeature;
      }
      const coordinates = getCoordinatesFromGeometries(features, isMultiGeometry);
      if (coordinates) {
        setFormData({
          geom: {
            type: geomTypeList[geomValues.geomType],
            coordinates,
          },
        });
      }
    },
    [geomValues.geomType, setFormData],
  );

  const getRoutingConfiguration = useCallback(() => {
    const {
      geomType,
      routingSettings,
    } = geomValues;

    const {
      config: {
        default: {
          map: { accessToken },
        },
      },
    } = settings;

    if (routingSettings?.length) {
      return {
        control: CONTROL_PATH,
        directionsThemes: getDirectionsThemes({ routingSettings, accessToken }),
        layersCustomisation: {
          pointCircleLayerCustomisation: {
            paint: {
              'circle-radius': 10,
              'circle-color': '#FFFFFF',
              'circle-stroke-width': 1,
              'circle-stroke-color': '#0D47A1',
            },
          },
          pointTextLayerCustomisation: { paint: { 'text-color': '#B71C1C' } },
          lineLayerCustomisation: {
            paint: { 'line-width': 4, 'line-color': '#0D47A1' },
          },
          phantomJunctionLineLayerCustomisation: {
            paint: {
              'line-width': 4,
              'line-color': '#0D47A1',
              'line-dasharray': [1, 1],
            },
          },
        },
        onPathUpdate: updateGeometryFromMap,
        order: 2,
        position: CONTROLS_TOP_LEFT,
        translate: t,
      };
    }

    return {
      control: CONTROL_DRAW,
      position: CONTROLS_TOP_LEFT,
      onDrawUpdate: updateGeometryFromMap,
      onDrawCreate: updateGeometryFromMap,
      onDrawDelete: updateGeometryFromMap,
      controls: {
        point: [ALL, POINT, MULTI_POINT].includes(geomType),
        line_string: [ALL, LINESTRING, MULTI_LINESTRING].includes(geomType),
        polygon: [ALL, POLYGON, MULTI_POLYGON].includes(geomType),
        trash: true,
        combine_features: [
          ALL,
          MULTI_POINT,
          MULTI_LINESTRING,
          MULTI_POLYGON,
        ].includes(geomType),
        uncombine_features: [
          ALL,
          MULTI_POINT,
          MULTI_LINESTRING,
          MULTI_POLYGON,
        ].includes(geomType),
      },
      order: 2,
    };
  }, [geomValues, settings, t, updateGeometryFromMap]);

  useEffect(() => {
    if (!map) {
      return () => null;
    }
    const {
      geom: geometry,
      identifier,
      layerName,
      routingSettings,
      routingInformation,
    } = geomValues;

    const layerId = getLayerId(layers, layerName);

    const onDrawControlAdded = () => {
      map.off('control_DrawControl_added', onDrawControlAdded);
      if (identifier) {
        map.setFilter(layerId, ['!=', '_id', identifier]);
      }
      if (map.draw) {
        map.draw.add(geometry);
      }
    };

    const onPathControlAdded = () => {
      map.off('control_PathControl_added', onPathControlAdded);
      if (identifier) {
        map.setFilter(layerId, ['!=', '_id', identifier]);
      }
      if (map.pathControl) {
        map.pathControl.setLineString({ geometry, properties: routingInformation });
      }
    };

    if (geometry?.coordinates.length) {
      if (routingSettings?.length) {
        map.on('control_PathControl_added', onPathControlAdded);
      } else {
        map.on('control_DrawControl_added', onDrawControlAdded);
      }
    }

    const control = getRoutingConfiguration();
    control && addControl(control);

    return () => {
      map.off('control_DrawControl_added', onDrawControlAdded);
      map.off('control_PathControl_added', onPathControlAdded);
      resetStyle();
    };
  }, [addControl, geomValues, getRoutingConfiguration, layers, map, resetStyle]);

  useEffect(() => {
    if (!featuresToFitBounds || !map) {
      return;
    }
    if (map.draw) {
      map.draw.deleteAll();
      featuresToFitBounds.forEach(feat => {
        map.draw.add(feat);
      });
    }
    if (map.pathControl) {
      map.pathControl.setFeatureCollection({ features: featuresToFitBounds });
    }
    setFitBounds({
      coordinates: featuresToFitBounds.flatMap(({ geometry: { coordinates } }) =>
        (Array.isArray(coordinates[0]) ? coordinates : [coordinates])),
      hasDetails: true,
    });
    const coordinates = getCoordinatesFromGeometries(featuresToFitBounds);
    if (coordinates) {
      setFormData({
        geom: {
          type: featuresToFitBounds[0].geometry.type,
          coordinates,
        },
      });
    }
    setFeaturesToFitBounds(null);
  }, [featuresToFitBounds, map, setFeaturesToFitBounds, setFitBounds, setFormData]);

  useEffect(
    () => () => {
      if (geomValues.routingSettings?.length) {
        removeControl(CONTROL_PATH);
      } else {
        removeControl(CONTROL_DRAW);
      }
      resetStyle();
    },
    [geomValues, removeControl, resetStyle],
  );

  return null;
};

MapInteraction.propTypes = {
  formData: PropTypes.shape({
    coordinates: PropTypes.array,
    type: PropTypes.string,
  }),
  name: PropTypes.string,
};

MapInteraction.defaultProps = {
  formData: {
    coordinates: [],
    type: '',
  },
  name: undefined,
};

export default memo(MapInteraction);
