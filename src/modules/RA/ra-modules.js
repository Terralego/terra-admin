import { ListGuesser } from 'react-admin';

// User
import userView from './User/views';
import userGroupView from './UserGroup/views';

// Visu
import dataSourceView from './DataSource/views';
import dataLayerView from './DataLayer/views';

// OPP
import viewpointView from './Viewpoint/views';

// User
export const RES_USER = 'user';
export const RES_USERGROUP = 'usergroup';

// Visu
export const RES_DATASOURCE = 'datasource';
export const RES_DATALAYER = 'datalayer';

// OPP
export const RES_VIEWPOINT = 'viewpoint';
export const RES_PICTURE = 'picture';
export const RES_CAMPAIGN = 'campaign';
export const RES_THEME = 'theme';

export const resources = [
  {
    name: RES_USER,
    moduleName: 'User',
    endpoint: 'user',
    ...userView,
  },
  {
    name: RES_USERGROUP,
    moduleName: 'User',
    endpoint: 'group',
    ...userGroupView,
  },
  {
    name: RES_DATASOURCE,
    moduleName: 'DataSource',
    endpoint: 'geosource',
    ...dataSourceView,
  },
  {
    name: RES_DATALAYER,
    moduleName: 'DataLayer',
    endpoint: 'geolayer',
    ...dataLayerView,
  },
  {
    name: RES_VIEWPOINT,
    moduleName: 'OPP',
    endpoint: 'viewpoints',
    ...viewpointView,
  },
  {
    name: RES_PICTURE,
    moduleName: 'OPP',
    endpoint: 'pictures',
    list: ListGuesser,
  },
  {
    name: RES_CAMPAIGN,
    moduleName: 'OPP',
    endpoint: 'campaigns',
    list: ListGuesser,
  },
  {
    name: RES_THEME,
    moduleName: 'OPP',
    endpoint: 'theme',
  },
];

export const config = {
  // path used by router to define when to display current module
  path: resources.map(({ name }) => `/${name}`),
  menu: [
    {
      label: 'user.project',
      items: resources.filter(({ moduleName }) => (moduleName === 'User')).map(({ name }) => ({
        label: `ra.nav.${name}_list`,
        href: `/${name}`,
      })),
    },
    {
      label: 'datalayer.project',
      items: resources.filter(({ moduleName }) => ['DataSource', 'DataLayer'].includes(moduleName)).map(({ name }) => ({
        label: `ra.nav.${name}_list`,
        href: `/${name}`,
      })),
    },
    {
      label: 'opp.project',
      items: resources.filter(({ moduleName }) => (moduleName === 'OPP')).map(({ name }) => ({
        label: `ra.nav.${name}_list`,
        href: `/${name}`,
      })),
    },
  ],
};

export default {
  resources,
  config,
};
