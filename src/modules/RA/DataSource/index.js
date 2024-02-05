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
export const CSV = 'CSVSource';
export const UTF8 = 'UTF8';
export const LATIN1 = 'LATIN1';
export const EPSG4326 = 'EPSG_4326';
export const EPSG2154 = 'EPSG_2154';
export const EPSG3857 = 'EPSG_3857';

const typesToChoices = types => Object.entries(types)
  .map(([id, name]) => ({ id, name }));

export const sourceTypes = {
  [GEOJSON]: 'GeoJSON',
  [SHP]: 'Shapefile',
  [SQL]: 'PostGIS',
  [WMTS]: 'WMTS',
  [CSV]: 'CSV',
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
  6: 'Date',
};

export const fieldTypeChoices = typesToChoices(fieldTypes);

export const encodingTypes = {
  [UTF8]: 'UTF-8',
  [LATIN1]: 'Latin-1',
};
export const fieldEncodingChoices = typesToChoices(encodingTypes);

export const scrTypes = {
  [EPSG4326]: 'EPSG:4326 - WGS 84',
  [EPSG2154]: 'EPSG:2154 - RGF93 / Lambert 93',
  [EPSG3857]: 'EPSG:3857 - WGS 84 / Pseudo-Mercator',
};
export const fieldSCRChoices = typesToChoices(scrTypes);

export const sourceStatusTypes = {
  0: 'datasource.refreshStatus.syncNeeded',
  1: 'datasource.refreshStatus.pending',
  2: 'datasource.refreshStatus.done',
};
export const sourceStatusChoices = typesToChoices(sourceStatusTypes);

export const reportStatusTypes = {
  0: 'datasource.refreshStatus.success',
  1: 'datasource.refreshStatus.error',
  2: 'datasource.refreshStatus.warning',
  3: 'datasource.refreshStatus.pending',
};
export const reportStatusChoices = typesToChoices(reportStatusTypes);
