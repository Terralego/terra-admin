import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { CONTROL_DRAW, CONTROLS_TOP_LEFT } from '@terralego/core/modules/Map';
import { geomTypes } from '../../../../../RA/DataSource/index';

import PropertyList from '../../PropertyList';

import {
  ALL,
  POINT,
  LINESTRING,
  POLYGON,
  MULTI_POINT,
  MULTI_LINESTRING,
  MULTI_POLYGON,
} from '../../../../../../utils/geom';

const getSchemaCoordinates = coordinates => {
  if (!Array.isArray(coordinates[0])) {
    return { type: 'number' };
  }
  return {
    items: getSchemaCoordinates(coordinates[0]),
    type: 'array',
  };
};

const getUISchemaCoordinates = coordinates => {
  const uiOptions = {
    addable: false,
    orderable: false,
    removable: false,
  };
  if (!Array.isArray(coordinates[0])) {
    return {
      'ui:options': uiOptions,
    };
  }
  return {
    items: getUISchemaCoordinates(coordinates[0]),
    'ui:options': uiOptions,
  };
};

const getJSONSchemaFromGeom = (
  { identifier, geom, geom_type: geomType, title, ...rest },
  index,
) => {
  const type = geomTypes[geomType];
  const value = geom !== null ? geom : { type, coordinates: [] };
  const { coordinates } = value;
  return {
    ...rest,
    display_value: value,
    method: (identifier !== null) ? 'PATCH' : 'POST',
    schema: {
      properties: {
        type: {
          type: 'string',
          title: 'Type',
        },
        coordinates: {
          items: getSchemaCoordinates(coordinates),
          type: 'array',
        },
      },
      required: ['type', index === 0 && 'coordinates'].filter(Boolean),
      title,
      type: 'object',
    },
    ui_schema: {
      coordinates: getUISchemaCoordinates(coordinates),
      type: {
        'ui:widget': 'hidden',
      },
    },
    title,
    type: 'object',
    value,
  };
};

const getProperties = geometries => {
  const properties = { ...geometries };
  Object.entries(properties).forEach(([key, value], index) => {
    properties[key] = getJSONSchemaFromGeom(value, index);
  });
  return properties;
};

const updateGeometry = ({
  features: [{ geometry, id }],
  geomType,
  geometries,
  name,
  setGeomValues,
  target: map,
  type,
}) => {
  if (type === 'draw.delete') {
    setGeomValues(getProperties({
      ...geometries,
      [name]: {
        ...geometries[name],
        geom: null,
      },
    }));
    return;
  }

  const { features } = map.draw.getAll();

  if (features.length > 1 && [POINT, LINESTRING, POLYGON].includes(geomType)) {
    map.draw.delete(
      features.reduce((list, feature) => (
        feature.id !== id
          ? [...list, feature.id]
          : list
      ), []),
    );
  }

  setGeomValues(getProperties({
    ...geometries,
    [name]: {
      ...geometries[name],
      geom: geometry,
    },
  }));
};

const initDraw = ({
  addControl,
  layerPaintId,
  map,
  name,
  geometries,
  setGeomValues,
}) => {
  const { [name]: { geom, identifier, geom_type: geomType } } = geometries;
  if (!Object.keys(map).length) {
    return;
  }

  const handleUpdateGeometry = event => (
    updateGeometry({ ...event, geomType, geometries, name, setGeomValues })
  );

  const control = {
    control: CONTROL_DRAW,
    position: CONTROLS_TOP_LEFT,
    onDrawUpdate: handleUpdateGeometry,
    onDrawCreate: handleUpdateGeometry,
    onDrawDelete: handleUpdateGeometry,
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

  if (geom !== null) {
    const onControlAdded = ({ control: addedControl }) => {
      if (addedControl !== control.control) {
        return;
      }
      map.setFilter(layerPaintId, ['!=', '_id', identifier]);
      map.draw.add(geom);
      map.off('control_added', onControlAdded);
    };
    map.on('control_added', onControlAdded);
  }
  addControl(control);
};

const getLayerPaintId = (layerPaints, name) => {
  const { id } = layerPaints.find(({ 'source-layer': source }) => source === name) || {};
  return id;
};

const resetStyle = (map, layerPaints, name) => {
  if (!map) {
    return;
  }
  const layerPaintId = getLayerPaintId(layerPaints, name);
  map.setFilter(layerPaintId, null);
};

const GeomView = ({
  addControl,
  layerPaints,
  map,
  removeControl,
  geometries,
}) => {
  const [geomValues, setGeomValues] = useState(getProperties(geometries));

  const onEdit = useCallback(name => {
    const layerPaintId = getLayerPaintId(layerPaints, name);
    initDraw({
      addControl,
      layerPaintId,
      map,
      name,
      geometries,
      setGeomValues,
    });
  }, [addControl, geometries, layerPaints, map]);

  const onRead = useCallback(name => {
    removeControl(CONTROL_DRAW);
    resetStyle(map, layerPaints, name);
  }, [layerPaints, map, removeControl]);

  useEffect(() => () => {
    removeControl(CONTROL_DRAW);
    setGeomValues(getProperties(geometries));
    Object.keys(geometries).forEach(name => {
      resetStyle(map, layerPaints, name);
    });
  }, [geometries, layerPaints, map, removeControl]);

  return (
    <PropertyList
      properties={geomValues}
      onEdit={onEdit}
      onRead={onRead}
      isGeom
    />
  );
};

GeomView.propTypes = {
  addControl: PropTypes.func,
  geometries: PropTypes.shape({}),
  layerPaints: PropTypes.arrayOf(
    PropTypes.shape({
      'source-layer': PropTypes.string,
    }),
  ),
  map: PropTypes.shape({}),
  removeControl: PropTypes.func,
};

GeomView.defaultProps = {
  addControl: () => {},
  geometries: {},
  layerPaints: [],
  map: {},
  removeControl: () => {},
};

export default GeomView;
