import React from 'react';
import { Admin, Resource } from 'react-admin';
import { withRouter } from 'react-router-dom';

import config from './config';
import NavLayout from '../../components/NavLayout';
import SimpleNav from '../../components/SimpleNav';
import { withLocale } from '../../components/Locale';
import providers from '../../services/react-admin/providers';
import RALayout from '../../components/react-admin/Layout';
import dataSourceViews from './views';
import {
  POINT,
  LINESTRING,
  POLYGON,
  MULTI_POINT,
  MULTI_LINESTRING,
  MULTI_POLYGON,
  GEOMETRY_COLLECTION,
} from '../../utils/geom';

import { resourceFullname as GeosourceResourceFullname } from '.';
import { resourceFullname as GeolayerResourceFullname } from '../DataLayer';

import './styles.scss';

export const DataSource = ({ locale, history }) => (
  <NavLayout nav={<SimpleNav config={config} />}>
    <Admin
      appLayout={RALayout}
      locale={`${locale}`.substr(0, 2)}
      history={history}
      {...providers}
    >
      <Resource name={GeosourceResourceFullname} {...dataSourceViews} />
      <Resource name={GeolayerResourceFullname} />
    </Admin>
  </NavLayout>
);

export default withRouter(withLocale(DataSource));

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
