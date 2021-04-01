// import { ListGuesser, EditGuesser } from 'react-admin';
import Api from '@terralego/core/modules/Api';

// User
import userViews from './User/views';
import userGroupViews from './UserGroup/views';

// Visu
import dataSourceViews from './DataSource/views';
import dataLayerViews from './DataLayer/views';
import sceneViews from './Scene/views';
import baseLayerViews from './BaseLayer/views';

// OPP
import viewpointViews from './Viewpoint/views';
import pictureViews from './Picture/views';
import campaignViews from './Campaign/views';

// const guessers = {
//   edit: EditGuesser,
//   list: ListGuesser,
// };

// Base map
export const RES_BASELAYER = 'baselayer';

// User
export const RES_USER = 'user';
export const RES_USERGROUP = 'usergroup';
export const RES_PERMISSION = 'permissions';

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
    name: RES_PERMISSION,
    moduleName: 'User',
    endpoint: 'permissions',
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
    beta: true, // Beta for now
    ...campaignViews,
  },
  {
    name: RES_BASELAYER,
    moduleName: 'BaseLayer',
    endpoint: 'baselayer',
    ...baseLayerViews,
  },
];

const byModule = (...modules) => ({ moduleName, list }) => list && modules.includes(moduleName);

export const config = {
  // path used by router to define when to display current module
  path: resources.map(({ name }) => `/${name}`),
  menu: [
    {
      label: 'user.project',
      // requiredPermissions: 'auth.change_group',
      requiredModule: 'User',
      items: resources.filter(byModule('User')).map(({ name, beta }) => ({
        label: `ra.nav.${name}_list`,
        href: `/${name}`,
        beta,
      })),
    },
    {
      label: 'datalayer.project',
      requiredModule: 'DataSource',
      items: resources.filter(byModule('DataSource', 'DataLayer')).map(({ name, beta }) => ({
        label: `ra.nav.${name}_list`,
        href: `/${name}`,
        beta,
      })),
    },
    {
      label: 'opp.project',
      requiredModule: 'OPP',
      items: resources.filter(byModule('OPP')).map(({ name, beta }) => ({
        label: `ra.nav.${name}_list`,
        href: `/${name}`,
        beta,
      })),
    },
    {
      label: 'baseLayer.project',
      requiredModule: 'BaseLayer',
      // requiredPermissions: 'can_manage_baselayers',
      items: resources.filter(byModule('BaseLayer')).map(({ name, beta }) => ({
        label: `ra.nav.${name}_list`,
        href: `/${name}`,
        beta,
      })),
    },
  ],
};

if (process.env.REACT_APP_NOT_DISPLAY_BASELAYERS) {
  config.menu.pop();
}

export const fetchFilterOptions = () => Api.request('viewpoints/filters/');

export default {
  resources,
  config,
};
