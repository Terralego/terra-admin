import { generateURIFactory } from '../../utils/routes';

const Map = () => import('./views/Map');

const path = '/CRUD';
const routes = [
  {
    path: `${path}/map/:layer?/:id?/:action?`,
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
  nav: [{
    label: 'CRUD.nav.map',
    href: 'map',
  }],
  routes,
};
