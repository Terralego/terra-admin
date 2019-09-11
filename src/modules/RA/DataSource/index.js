import {
  POINT,
  LINESTRING,
  POLYGON,
  MULTI_POINT,
  MULTI_LINESTRING,
  MULTI_POLYGON,
  GEOMETRY_COLLECTION,
} from '../../../utils/geom';

export const GEOJSON = 'GeoJSONSource';
export const SQL = 'PostGISSource';
export const WMTS = 'WMTSSource';
export const SHP = 'ShapefileSource';

const typesToChoices = types => Object.entries(types)
  .map(([id, name]) => ({ id, name }));

export const sourceTypes = {
  [GEOJSON]: 'GeoJSON',
  [SHP]: 'Shapefile',
  [SQL]: 'PostGIS',
  [WMTS]: 'WMTS',
};
export const sourceTypeChoices = typesToChoices(sourceTypes);

export const geomTypes = {
  [POINT]: 'Point',
  [LINESTRING]: 'LineString',
  // 2: 'LinearRi',
  [POLYGON]: 'Polygon',
  [MULTI_POINT]: 'MultiPoint',
  [MULTI_LINESTRING]: 'MultiLineString',
  [MULTI_POLYGON]: 'MultiPolygon',
  [GEOMETRY_COLLECTION]: 'GeometryCollection',
};
export const geomTypeChoices = typesToChoices(geomTypes);

export const fieldTypes = {
  1: 'String',
  2: 'Integer',
  3: 'Float',
  4: 'Boolean',
  5: 'Undefined',
};
export const fieldTypeChoices = typesToChoices(fieldTypes);
