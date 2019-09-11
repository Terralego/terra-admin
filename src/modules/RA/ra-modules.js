import userView from './User/views';
import userGroupView from './UserGroup/views';
import dataSourceView from './DataSource/views';
import dataLayerView from './DataLayer/views';

export const resources = [
  {
    name: 'user',
    ...userView,
  },
  {
    name: 'usergroup',
    ...userGroupView,
  },
  {
    name: 'datasource',
    ...dataSourceView,
  },
  {
    name: 'datalayer',
    ...dataLayerView,
  },
];

export const config = {
  title: 'Common',
  path: resources.map(({ name }) => `/${name}`),
  nav: [
    {
      label: 'user_label',
      href: '/user',
    },
    {
      label: 'usergroup_label',
      href: '/usergroup',
    },
    {
      label: 'datalayer_label',
      href: '/datalayer',
    },
    {
      label: 'datasource_label',
      href: '/datasource',
    },
  ],
};

export default {
  resources,
  config,
};
