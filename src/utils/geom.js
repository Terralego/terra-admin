export const ALL = null;
export const POINT = 0;
export const LINESTRING = 1;
export const POLYGON = 3;
export const MULTI_POINT = 4;
export const MULTI_LINESTRING = 5;
export const MULTI_POLYGON = 6;
export const GEOMETRY_COLLECTION = 7;
export const GEOM_UNDEFINED = '8';

export const getShapeFromGeomType = geomType => {
  switch (geomType) {
    case POINT:
    case MULTI_POINT:
      return 'circle';
    case LINESTRING:
    case MULTI_LINESTRING:
      return 'line';
    case GEOM_UNDEFINED:
      return null;
    case undefined:
    case null:
      return undefined;
    default:
      return 'fill';
  }
};

export const getLayerStyleDefaultValue = (color, type) => {
  if (!type) {
    return undefined;
  }
  return {
    type,
    paint: {
      [`${type}-color`]: color,
    },
  };
};

export default {
  ALL,
  POINT,
  LINESTRING,
  POLYGON,
  MULTI_POINT,
  MULTI_LINESTRING,
  MULTI_POLYGON,
  GEOMETRY_COLLECTION,
};
