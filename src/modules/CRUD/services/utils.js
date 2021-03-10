import Api from '@terralego/core/modules/Api';
import { geomTypes } from '../../RA/DataSource/index';


import {
  POINT,
  LINESTRING,
  POLYGON,
  MULTI_POINT,
  MULTI_LINESTRING,
  MULTI_POLYGON,
  GEOMETRY_COLLECTION,
} from '../../../utils/geom';

export const getObjectOrderedValue = (objectValues, arrayOrder = []) => {
  if (!objectValues) {
    return {};
  }
  const UIOrderReverse = [...arrayOrder].reverse();
  return Object.keys(objectValues).sort(
    ((a, b) => UIOrderReverse.indexOf(b) - UIOrderReverse.indexOf(a)),
  ).reduce((acc, prop) => (
    { ...acc, [prop]: objectValues[prop] }
  ), {});
};

export const isTableObject = (arrayOfObjects = []) => {
  if (!arrayOfObjects.length) {
    return false;
  }
  const firstKeys = Object.keys(arrayOfObjects[0]).join();
  return arrayOfObjects.every(obj => Object.keys(obj).join() === firstKeys);
};

export const sanitizeCustomEndpoint = str => {
  if (str.startsWith('/api/')) {
    return str.replace('/api/', '');
  }
  return str;
};

export const exportFileFromURL = async (url, name) => {
  const data = await Api.request(sanitizeCustomEndpoint(url), { responseType: 'text' });
  const file = new Blob([data], { type: 'text/plain' });

  const [fileName] = url.split('/').slice(-1);
  const link = document.createElement('a');
  link.download = name || fileName;
  link.href = global.URL.createObjectURL(file);
  link.click();
};


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

const getDefaultCoordinatesByGeomType = geomType => {
  switch (geomType) {
    case LINESTRING:
    case MULTI_POINT:
      return [[], []];
    case POLYGON:
    case MULTI_LINESTRING:
      return [[[], []]];
    case MULTI_POLYGON:
      return [[[[], []]]];
    case GEOMETRY_COLLECTION:
      return [{}];
    case POINT:
    default:
      return [];
  }
};

export const getJSONSchemaFromGeom = (
  { identifier, geom, geom_type: geomType, title, ...rest },
  notRequired,
) => {
  const type = geomTypes[geomType];
  const value = geom || { type, coordinates: [] };
  const { coordinates } = geom || {};
  const coordinatesCalculated = coordinates && coordinates.length
    ? coordinates
    : getDefaultCoordinatesByGeomType(geomType);
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
          items: getSchemaCoordinates(coordinatesCalculated),
          type: 'array',
        },
      },
      required: ['type', !notRequired && 'coordinates'].filter(Boolean),
      title,
      type: 'object',
    },
    ui_schema: {
      'ui:field': 'geometry',
      coordinates: getUISchemaCoordinates(coordinatesCalculated),
      type: {
        'ui:widget': 'hidden',
      },
    },
    title,
    type: 'object',
    value,
  };
};

/**
 * Clean all useless properties and keep required properties
 * 1/ Flat all props by removing groups
 * 2/ Keep only required props
 *
 * @param {Object} props JSON schema properties
 * @returns {Object} JSON schema properties cleaned
 */
export const requiredProperties = props => {
  const propertiesWithoutGroup = Object.values(props).reduce((list, value) => {
    const { type, properties, required = [] } = value;

    if (type === 'object' && required.length) {
      const requiredProps = Object.entries(properties).reduce((acc, [subKey, subValue]) => (
        required.includes(subKey)
          ? ({ ...acc, [subKey]: subValue })
          : acc
      ), {});

      return {
        ...list,
        properties: { ...list.properties, ...requiredProps },
        required: [...list.required, ...required],
      };
    }

    return list;
  }, { properties: {}, required: [] });

  return propertiesWithoutGroup;
};

export default {
  exportFileFromURL,
  getJSONSchemaFromGeom,
  getObjectOrderedValue,
  isTableObject,
  requiredProperties,
  sanitizeCustomEndpoint,
};
