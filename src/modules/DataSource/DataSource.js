import React from 'react';
import { Admin, Resource } from 'react-admin';

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

import './styles.scss';

export const DataSource = ({ locale }) => (
  <NavLayout nav={<SimpleNav items={config.nav} />}>
    <Admin
      appLayout={RALayout}
      {...providers}
      locale={`${locale}`.substr(0, 2)}
    >
      <Resource
        name="geosource"
        {...dataSourceViews}
      />
      <Resource
        name="geolayer"
      />
    </Admin>
  </NavLayout>
);

export default withLocale(DataSource);

export const GEOJSON = 'GeoJSONSource';
export const SQL = 'PostGISSource';
export const WMTS = 'WMTSSource';

const typesToChoices = types => Object.entries(types)
  .map(([id, name]) => ({ id, name }));

export const sourceTypes = {
  [GEOJSON]: 'GeoJSON',
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
