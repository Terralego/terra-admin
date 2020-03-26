import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { CONTROL_DRAW, CONTROLS_TOP_LEFT } from '@terralego/core/modules/Map';
import PropTypes from 'prop-types';
import { ACTION_CREATE, getView } from '../../../modules/CRUD/services/CRUD';

import {
  ALL,
  POINT,
  LINESTRING,
  POLYGON,
  MULTI_POINT,
  MULTI_LINESTRING,
  MULTI_POLYGON,
} from '../../../utils/geom';

import PointField from './PointField';
import DefaultField from './DefaultField';

const getLayerPaintId = (layerPaints, name) => {
  const { id } = layerPaints.find(({ 'source-layer': source }) => source === name) || {};
  return id;
};

const resetStyle = (map, layerPaints, name) => {
  if (!Object.keys(map).length) {
    return;
  }
  const layerPaintId = getLayerPaintId(layerPaints, name);
  map.setFilter(layerPaintId, null);
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
  formData: { coordinates, type },
  params: { id, layer },
  name,
  settings,
}) => {
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


const GeometryField = ({
  addControl,
  feature,
  formData,
  layerPaints,
  map,
  match: { params },
  removeControl,
  name,
  settings,
  t,
  ...rest
}) => {
  const geometries = useMemo(() => (
    getGeometries(({ feature, formData, params, name, settings }))
  ), [feature, formData, params, name, settings]);

  const [geomValues, setGeomValues] = useState(geometries);

  useEffect(() => {
    setGeomValues(geometries);
  // Disabling `geometries` because it's only necessary updating value on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const updateGeometryFromMap = useCallback(({
    features: [{ geometry, id }],
    target,
    type,
  }) => {
    if (type === 'draw.delete') {
      setGeomValues(prevGeomValues => ({
        ...prevGeomValues,
        geom: null,
      }));
      return;
    }

    const { features } = target.draw.getAll();

    if (features.length > 1 && [POINT, LINESTRING, POLYGON].includes(geomValues.geom_type)) {
      const otherFeaturesIds = features.reduce((list, item) => (
        item.id === id ? list : [...list, item.id]
      ), []);

      target.draw.delete(otherFeaturesIds);
    }

    setGeomValues(prevGeomValues => ({
      ...prevGeomValues,
      geom: geometry,
    }));
  }, [geomValues.geom_type]);


  const setMapControls = useCallback(({
    layerPaintId,
  }) => {
    const { geom, identifier, geom_type: geomType } = geomValues;
    if (!Object.keys(map).length) {
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
        combine_features: false,
        uncombine_features: false,
      },
      order: 2,
    };

    if (geom && geom.coordinates.length) {
      const onControlAdded = ({ control: addedControl }) => {
        if (addedControl !== control.control) {
          return;
        }
        if (identifier) {
          map.setFilter(layerPaintId, ['!=', '_id', identifier]);
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
    const layerPaintId = getLayerPaintId(layerPaints, geomValues.layerName);
    setMapControls({ layerPaintId });
  }, [geomValues.layerName, setMapControls, layerPaints]);

  useEffect(() => () => {
    removeControl(CONTROL_DRAW);
    resetStyle(map, layerPaints, geomValues.layerName);
  }, [geomValues.layerName, layerPaints, map, removeControl]);

  const TypeField = formData.type === 'Point' ? PointField : DefaultField;

  return (
    <fieldset>
      <legend>{t('jsonSchema.geometryField.title')}</legend>
      <div className="form-group field">
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
  t: PropTypes.func,
};

GeometryField.defaultProps = {
  addControl: () => {},
  map: {},
  formData: {
    type: '',
  },
  removeControl: () => {},
  t: text => text,
};

export default GeometryField;
