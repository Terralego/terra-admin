import userView from './User/views';
import userGroupView from './UserGroup/views';
import dataSourceView from './DataSource/views';
import dataLayerView from './DataLayer/views';

export const RES_USER = 'user';
export const RES_USERGROUP = 'usergroup';
export const RES_DATASOURCE = 'datasource';
export const RES_DATALAYER = 'datalayer';

export const resources = [
  {
    name: RES_USER,
    moduleName: 'User',
    endpoint: 'user',
    ...userView,
  },
  {
    name: RES_USERGROUP,
    moduleName: 'group',
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
];

export const config = {
  title: 'Common',
  path: resources.map(({ name }) => `/${name}`),
  nav: [
    {
      label: 'ra.nav.user_list',
      href: `/${RES_USER}`,
    },
    {
      label: 'ra.nav.usergroup_list',
      href: `/${RES_USERGROUP}`,
    },
    {
      label: 'ra.nav.datalayer_list',
      href: `/${RES_DATASOURCE}`,
    },
    {
      label: 'ra.nav.datasource_list',
      href: `/${RES_DATALAYER}`,
    },
  ],
};

export default {
  resources,
  config,
};
