import { connectAppProvider } from '../../../components/AppProvider';
import { Content } from './Content';
import { getModulesComponentsByPermissions } from '../../../services/modules';


const getDefaultRoute = landingModule => {
  if (!landingModule) {
    return '';
  }
  const [{ config: { path } }] = getModulesComponentsByPermissions([landingModule]);
  return path;
};

export default connectAppProvider(({ env: { permissions, landing_module: landingModule } }) => ({
  modules: getModulesComponentsByPermissions(permissions),
  defaultRoute: getDefaultRoute(landingModule),
  landingModule,
}))(Content);
