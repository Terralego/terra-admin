import { generateURIFactory } from '../../utils/routes';

const Map = () => import('./views/Map');

const path = '/rando';
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
  title: 'rando.project',
  path,
  nav: [{
    label: 'rando.nav.map',
    href: 'map',
  }],
  routes,
};
