import { generateURIFactory } from '../../utils/routes';

const MapProvider = () => import('./views/MapPlayground/MapProvider');
const MapPlayground = () => import('./views/MapPlayground');

const path = '/CRUD';
const routes = [
  {
    path: `${path}/map/:layer?/:id?/:section?/:category?`,
    import: MapPlayground,
    name: 'layer',
    provider: MapProvider,
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
