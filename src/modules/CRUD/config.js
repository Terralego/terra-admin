import { generateURIFactory } from '../../utils/routes';

const MapProvider = () => import('./views/Map/MapProvider');
const Map = () => import('./views/Map');

const path = '/CRUD';
const routes = [
  {
    path: `${path}/map/:layer?/:id?/:section?/:category?`,
    import: Map,
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
