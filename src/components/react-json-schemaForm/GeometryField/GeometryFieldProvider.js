import React, { createContext, useContext, useEffect, useReducer, useMemo, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { CRUDContext } from '../../../modules/CRUD/services/CRUDProvider';
import { MapContext } from '../../../modules/CRUD/services/MapProvider';
import { ACTION_CREATE } from '../../../modules/CRUD/services/CRUD';
import { getCoordinatesFromGeometries, getGeometries } from './utils';


export const GeometryFieldContext = createContext({});
export const useGeometryField = () => useContext(GeometryFieldContext);

function reducer (state, action) {
  return { ...state, ...action };
}

export const GeometryFieldProvider = ({ children, formData, onChange, name, schema }) => {
  const {
    feature,
    settings,
  } = useContext(CRUDContext);

  const {
    map,
    setFitBounds,
  } = useContext(MapContext);

  const params = useParams();

  const geometries = useMemo(
    () => getGeometries({ feature, formData, params, name, settings }),
    [feature, formData, name, params, settings],
  );

  const [geomValues, setGeomValues] = useState(geometries);

  const isRouting = formData?.type === 'LineString' && geomValues?.routingSettings.length && geomValues?.isMainLayer;

  const [nextFormData, setNextFormData] = useReducer(reducer, {
    geom: geomValues.geom,
    routingInformation: geomValues.routingInformation,
  });

  useEffect(() => {
    setGeomValues(geometries);
    return () => {
      setGeomValues(geometries);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, geometries.geom?.type, isRouting]);

  useEffect(() => {
    setNextFormData({
      geom: geomValues.geom,
      ...(isRouting && { routingInformation: geomValues.routingInformation }),
    });
    return () => {
      setNextFormData({
        geom: geomValues.geom,
        ...(isRouting && { routingInformation: geomValues.routingInformation }),
      });
    };
  }, [geomValues.geom, geomValues.routingInformation, isRouting, params]);

  const setFeaturesToFitBounds = useCallback(featuresToFitBounds => {
    if (!featuresToFitBounds || !map) {
      return;
    }

    setFitBounds({
      coordinates: featuresToFitBounds.flatMap(({ geometry: { coordinates } }) =>
        (Array.isArray(coordinates[0]) ? coordinates : [coordinates])),
      hasDetails: true,
    });

    const coordinates = getCoordinatesFromGeometries(featuresToFitBounds);

    let geom = {
      type: featuresToFitBounds[0].geometry.type,
      coordinates,
    };
    let routingInformation = null;
    if (map.draw) {
      map.draw.deleteAll();
      featuresToFitBounds.forEach(feat => {
        map.draw.add(feat);
      });
    }
    if (map.pathControl) {
      map.pathControl.setFeatureCollection({ features: featuresToFitBounds });
      const { geometry, properties } = map.pathControl.getLineString();
      geom = geometry;
      routingInformation = properties;
    }

    if (coordinates) {
      setNextFormData({
        geom,
        ...(routingInformation && { routingInformation }),
      });
    }
  }, [map, setFitBounds]);

  const resetFeatureCollection = useCallback(() => {
    if (!map) {
      return;
    }
    if (map.pathControl) {
      map.pathControl.clearFeatureCollection();
    } else if (map.draw) {
      map.draw.deleteAll();
    }

    setNextFormData({
      geom: {
        ...nextFormData.geometry,
        coordinates: [],
      },
      routingInformation: undefined,
    });
  }, [map, nextFormData.geometry]);

  const isRequired = schema.required?.includes('coordinates');
  const isRequiredInEditView = isRequired && params.id !== ACTION_CREATE;

  useEffect(() => {
    onChange(nextFormData);
  }, [nextFormData, onChange]);

  const value = {
    geomValues,
    isRequired,
    isRequiredInEditView,
    isRouting,
    nextFormData,
    resetFeatureCollection,
    setFeaturesToFitBounds,
    setNextFormData,
  };

  return (
    <GeometryFieldContext.Provider value={value}>
      {children}
    </GeometryFieldContext.Provider>
  );
};

export default GeometryFieldProvider;
