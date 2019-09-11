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
    endpoint: 'user',
    ...userView,
  },
  {
    name: RES_USERGROUP,
    endpoint: 'group',
    ...userGroupView,
  },
  {
    name: RES_DATASOURCE,
    endpoint: 'geosource',
    ...dataSourceView,
  },
  {
    name: RES_DATALAYER,
    endpoint: 'geolayer',
    ...dataLayerView,
  },
];

export const config = {
  title: 'Common',
  path: resources.map(({ name }) => `/${name}`),
  nav: [
    {
      label: 'user_label',
      href: `/${RES_USER}`,
    },
    {
      label: 'usergroup_label',
      href: `/${RES_USERGROUP}`,
    },
    {
      label: 'datalayer_label',
      href: `/${RES_DATASOURCE}`,
    },
    {
      label: 'datasource_label',
      href: `/${RES_DATALAYER}`,
    },
  ],
};

export default {
  resources,
  config,
};
