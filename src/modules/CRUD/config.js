import { generateURIFactory } from '../../utils/routes';

const Map = () => import('./views/Map');

const path = '/CRUD';
const routes = [
  {
    path: `${path}/map/:layer?/:id?/:action?/:section?/:category?`,
    import: Map,
    name: 'layer',
  },
  {
    path,
    redirect: `${path}/map`,
  },
];

export const generateURI = generateURIFactory(routes);

export default {
  title: 'CRUD.project',
  path,

  menu: [
    {
      label: 'CRUD.project',
      items: [
        {
          label: 'CRUD.nav.map',
          href: '/CRUD/map',
        },
      ],
    },
  ],

  routes,
};
