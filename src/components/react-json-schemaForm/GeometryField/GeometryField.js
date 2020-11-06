import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { CONTROL_DRAW, CONTROLS_TOP_LEFT } from '@terralego/core/modules/Map';
import PropTypes from 'prop-types';
import { ACTION_CREATE, getLayers, getView } from '../../../modules/CRUD/services/CRUD';


import {
  ALL,
  POINT,
  LINESTRING,
  POLYGON,
  MULTI_POINT,
  MULTI_LINESTRING,
  MULTI_POLYGON,
} from '../../../utils/geom';

import ImportGeomFile from '../../ImportGeomFile';

import PointField from './PointField';
import DefaultField from './DefaultField';
import './styles.scss';

const getLayerId = (layers, name) => {
  const { id } = layers.find(({ 'source-layer': source }) => source === name) || {};
  return id;
};

const resetStyle = (map, layers, name) => {
  if (!map) {
    return;
  }
  map.setFilter(getLayerId(layers, name), null);
};

/**
 * Get geometries from
 * -settings informations if this is a new one
 * -feature's stored if this is an update
 *
 * @param {Object} {
 *   feature,
 *   formData: { coordinates, type },
 *   params: { id, layer },
 *   name,
 *   settings,
 * }
 * @returns an object wrapping
 * the name, identifier, geometry and endpoint (to save the feature) to manipulate
 */
const getGeometries = ({
  feature,
  formData,
  params: { id, layer },
  name,
  settings,
}) => {
  const { coordinates = [], type } = formData || {};
  if (id === ACTION_CREATE) {
    const { layer: { name: layerName, ...rest }, featureEndpoint } = getView(settings, layer);
    return {
      ...rest,
      identifier: null,
      geom: { coordinates, type },
      layerName,
      url: featureEndpoint,
    };
  }
  const { geometries: { [name]: featureName } } = feature[id];
  return { layerName: name, ...featureName };
};

const getCoordinatesFromGeometries = (features, isMultiGeometry) => {
  const featuresHasCompositesType = features
    .filter((item, index, array) => array.indexOf(item) === index).length === 2;

  if (featuresHasCompositesType || isMultiGeometry) {
    return features.reduce((list, { geometry: { type, coordinates } }) => (
      (type.startsWith('Multi'))
        ? [...list, ...coordinates]
        : [...list, coordinates]
    ), []);
  }
  return features.flatMap(({ geometry: { coordinates } }) => coordinates);
};

const GeometryField = ({
  addControl,
  feature,
  formData,
  layerPaints,
  map,
  match: { params },
  removeControl,
  name,
  setFitBounds,
  settings,
  t,
  ...rest
}) => {
  const layers = useMemo(() => (
    getLayers(settings)
  ), [settings]);


  const geometries = useMemo(() => (
    getGeometries(({ feature, formData, params, name, settings }))
  ), [feature, formData, params, name, settings]);

  const [geomValues, setGeomValues] = useState(geometries);

  useEffect(() => {
    setGeomValues(geometries);
  // Disabling `geometries` because it's only necessary updating value on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, formData.type]);

  const updateGeometryFromMap = useCallback(({
    features: [{ id }],
    target,
  }) => {
    let { features } = target.draw.getAll();

    const isMultiGeometry = ![POINT, LINESTRING, POLYGON].includes(geomValues.geom_type);

    if (features.length > 1 && !isMultiGeometry) {
      const { currentFeature, otherFeaturesIds } = features.reduce((list, item) => {
        if (item.id === id) {
          list.currentFeature.push(item);
        } else {
          list.otherFeaturesIds.push(item.id);
        }
        return list;
      }, { currentFeature: [], otherFeaturesIds: [] });

      target.draw.delete(otherFeaturesIds);
      features = currentFeature;
    }

    setGeomValues(prevGeomValues => ({
      ...prevGeomValues,
      geom: {
        ...prevGeomValues.geom,
        coordinates: getCoordinatesFromGeometries(features, isMultiGeometry),
      },
    }));
  }, [geomValues.geom_type]);

  const importDraw = useCallback(features => {
    map.draw.deleteAll();
    features.forEach(feat => map.draw.add(feat));
    setFitBounds({
      coordinates: features.flatMap(({ geometry: { coordinates } }) => coordinates),
      hasDetails: true,
    });

    setGeomValues(prevGeomValues => ({
      ...prevGeomValues,
      geom: {
        ...prevGeomValues.geom,
        coordinates: getCoordinatesFromGeometries(features),
      },
    }));
  }, [map, setFitBounds]);

  const setMapControls = useCallback(({
    layerId,
  }) => {
    const { geom, identifier, geom_type: geomType } = geomValues;
    if (!map) {
      return;
    }

    const control = {
      control: CONTROL_DRAW,
      position: CONTROLS_TOP_LEFT,
      onDrawUpdate: updateGeometryFromMap,
      onDrawCreate: updateGeometryFromMap,
      onDrawDelete: updateGeometryFromMap,
      controls: {
        point: [ALL, POINT, MULTI_POINT].includes(geomType),
        line_string: [ALL, LINESTRING, MULTI_LINESTRING].includes(geomType),
        polygon:  [ALL, POLYGON, MULTI_POLYGON].includes(geomType),
        trash: true,
        combine_features: [ALL, MULTI_POINT, MULTI_LINESTRING, MULTI_POLYGON].includes(geomType),
        uncombine_features: [ALL, MULTI_POINT, MULTI_LINESTRING, MULTI_POLYGON].includes(geomType),
      },
      order: 2,
    };

    if (geom && geom.coordinates.length) {
      const onControlAdded = ({ control: addedControl }) => {
        if (addedControl !== control.control) {
          return;
        }
        if (identifier) {
          map.setFilter(layerId, ['!=', '_id', identifier]);
        }
        map.draw.add(geom);
        map.off('control_added', onControlAdded);
      };
      map.on('control_added', onControlAdded);
    }

    addControl(control);
  // Disabling `geomValues` because it's only necessary updating value on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addControl, map, updateGeometryFromMap]);

  useEffect(() => {
    const layerId = getLayerId(layers, geomValues.layerName);
    setMapControls({ layerId });
  }, [geomValues.layerName, setMapControls, layers]);

  useEffect(() => () => {
    removeControl(CONTROL_DRAW);
    resetStyle(map, layers, geomValues.layerName);
  }, [geomValues.layerName, layers, map, removeControl]);

  const TypeField = formData.type === 'Point' ? PointField : DefaultField;

  return (
    <fieldset>
      <legend>{t('jsonSchema.geometryField.title')}</legend>
      <div className="form-group field">
        <ImportGeomFile
          geomType={geomValues.geom_type}
          hasDraws={Boolean(geomValues?.geom?.coordinates.length)}
          onSubmit={importDraw}
        />
        <p className="form-group__or">{t('jsonSchema.geometryField.or')}</p>
        <TypeField {...rest} formData={geomValues.geom || formData} t={t} />
      </div>
    </fieldset>
  );
};

GeometryField.propTypes = {
  addControl: PropTypes.func,
  formData: PropTypes.shape({
    type: PropTypes.string,
  }),
  map: PropTypes.shape({}),
  removeControl: PropTypes.func,
  settings: PropTypes.shape({}),
  t: PropTypes.func,
};

GeometryField.defaultProps = {
  addControl: () => {},
  map: undefined,
  formData: {
    type: '',
  },
  removeControl: () => {},
  settings: undefined,
  t: text => text,
};

export default GeometryField;
