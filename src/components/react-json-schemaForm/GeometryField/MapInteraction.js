import { memo, useCallback, useEffect, useMemo, useContext } from 'react';
import { useTranslation } from 'react-i18next';

import {
  CONTROL_DRAW,
  CONTROL_PATH,
  CONTROLS_TOP_LEFT,
} from '@terralego/core/modules/Map';
import { getCoordinatesFromGeometries, getDirectionsThemes, getLayerId } from './utils';

import { getLayers } from '../../../modules/CRUD/services/CRUD';

import { CRUDContext } from '../../../modules/CRUD/services/CRUDProvider';
import { MapContext } from '../../../modules/CRUD/services/MapProvider';
import { useGeometryField } from './GeometryFieldProvider';
import arrow from './arrow.png';

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

const MapInteraction = () => {
  const { t } = useTranslation();

  const {
    geomValues,
    setNextFormData: setFormData,
  } = useGeometryField();

  const { settings } = useContext(CRUDContext);
  const isRouting = geomValues.routingSettings?.length && geomValues.isMainLayer;

  const {
    addControl,
    map,
    removeControl,
  } = useContext(MapContext);

  const layers = useMemo(() => getLayers(settings), [settings]);

  useEffect(() => {
    if (!map) {
      return;
    }
    if (!map.hasImage('arrow')) {
      map.loadImage(arrow, (error, image) => {
        if (error) throw error;
        if (!map.hasImage('arrow')) map.addImage('arrow', image);
      });
    }
  }, [map]);

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


    if (isRouting) {
      return {
        control: CONTROL_PATH,
        directionsThemes: getDirectionsThemes({ routingSettings, accessToken }),
        layersCustomisation: {
          pointLayerList: [{
            paint: {
              'circle-radius': 10,
              'circle-color': '#FFFFFF',
              'circle-stroke-width': 1,
              'circle-stroke-color': '#0D47A1',
            },
          }, {
            paint: {
              'text-color': '#B71C1C',
            },
            type: 'symbol',
            layout: {
              'text-field': ['to-string', ['+', ['get', 'index'], 1]],
              'text-allow-overlap': true,
            },
          }],
          lineLayerList: [{
            paint: { 'line-width': 5, 'line-color': '#0D47A1' },
          }, {
            type: 'symbol',
            layout: {
              'icon-image': 'arrow',
              'icon-size': 0.6,
              'symbol-placement': 'line',
              'icon-allow-overlap': true,
            },
          }],
          phantomJunctionLineLayerList: [{
            paint: {
              'line-width': 5,
              'line-color': '#0D47A1',
              'line-dasharray': [1, 1],
            },
          }],
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
  }, [geomValues, isRouting, settings, t, updateGeometryFromMap]);

  useEffect(() => {
    if (!map) {
      return () => null;
    }
    const {
      geom: geometry,
      identifier,
      layerName,
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
      if (isRouting) {
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
  }, [addControl, geomValues, getRoutingConfiguration, isRouting, layers, map, resetStyle]);


  useEffect(
    () => () => {
      if (isRouting) {
        removeControl(CONTROL_PATH);
      } else {
        removeControl(CONTROL_DRAW);
      }
      resetStyle();
    },
    [isRouting, removeControl, resetStyle],
  );

  return null;
};

export default memo(MapInteraction);
