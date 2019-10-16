import { ListGuesser, EditGuesser } from 'react-admin';

// User
import userViews from './User/views';
import userGroupViews from './UserGroup/views';

// Visu
import dataSourceViews from './DataSource/views';
import dataLayerViews from './DataLayer/views';
import sceneViews from './Scene/views';

// OPP
import viewpointViews from './Viewpoint/views';
import pictureViews from './Picture/views';

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
export const RES_VIEW = 'view';

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
    ...userViews,
  },
  {
    name: RES_USERGROUP,
    moduleName: 'User',
    // requiredPermissions: 'auth.change_group',
    endpoint: 'groups',
    ...userGroupViews,
  },
  {
    name: RES_DATASOURCE,
    moduleName: 'DataSource',
    endpoint: 'geosource',
    ...dataSourceViews,
  },
  {
    name: RES_DATALAYER,
    moduleName: 'DataLayer',
    endpoint: 'geolayer',
    ...dataLayerViews,
  },
  {
    name: RES_VIEW,
    moduleName: 'DataLayer',
    endpoint: 'geolayer/scene',
    ...sceneViews,
  },
  {
    name: RES_VIEWPOINT,
    moduleName: 'OPP',
    endpoint: 'viewpoints',
    ...viewpointViews,
  },
  {
    name: RES_PICTURE,
    moduleName: 'OPP',
    endpoint: 'pictures',
    ...pictureViews,
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
      requiredModule: 'User',
      items: resources.filter(byModule('User')).map(({ name }) => ({
        label: `ra.nav.${name}_list`,
        href: `/${name}`,
      })),
    },
    {
      label: 'datalayer.project',
      requiredModule: 'DataSource',
      items: resources.filter(byModule('DataSource', 'DataLayer')).map(({ name }) => ({
        label: `ra.nav.${name}_list`,
        href: `/${name}`,
      })),
    },
    {
      label: 'opp.project',
      requiredModule: 'OPP',
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
