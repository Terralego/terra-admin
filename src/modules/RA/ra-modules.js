import { ListGuesser, EditGuesser } from 'react-admin';

// User
import userView from './User/views';
import userGroupView from './UserGroup/views';

// Visu
import dataSourceView from './DataSource/views';
import dataLayerView from './DataLayer/views';

// OPP
import viewpointView from './Viewpoint/views';

const guessers = {
  edit: EditGuesser,
  list: ListGuesser,
};

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

export const resources = [
  {
    name: RES_USER,
    moduleName: 'User',
    // requiredPermissions: 'auth.change_group',
    endpoint: 'user',
    ...userView,
  },
  {
    name: RES_USERGROUP,
    moduleName: 'User',
    // requiredPermissions: 'auth.change_group',
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
    ...guessers,
  },
  {
    name: RES_CAMPAIGN,
    moduleName: 'OPP',
    endpoint: 'campaigns',
    ...guessers,
  },
];

const byModule = (...modules) => ({ moduleName }) => modules.includes(moduleName);

export const config = {
  // path used by router to define when to display current module
  path: resources.map(({ name }) => `/${name}`),
  menu: [
    {
      label: 'user.project',
      // requiredPermissions: 'auth.change_group',
      items: resources.filter(byModule('User')).map(({ name }) => ({
        label: `ra.nav.${name}_list`,
        href: `/${name}`,
      })),
    },
    {
      label: 'datalayer.project',
      items: resources.filter(byModule('DataSource', 'DataLayer')).map(({ name }) => ({
        label: `ra.nav.${name}_list`,
        href: `/${name}`,
      })),
    },
    {
      label: 'opp.project',
      items: resources.filter(byModule('OPP')).map(({ name }) => ({
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
