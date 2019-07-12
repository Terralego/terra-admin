import { connectAppProvider } from '../../../components/AppProvider';
import { Content } from './Content';
import { getComponentsByEnabledModules } from '../../../services/modules';


const getDefaultRoute = landingModule => {
  if (!landingModule) {
    return '';
  }
  const [{ config: { path } }] = getComponentsByEnabledModules([landingModule]);
  return path;
};

export default connectAppProvider(({
  env: { enabled_modules: enabledModules, landing_module: landingModule },
}) => ({
  modules: getComponentsByEnabledModules(enabledModules),
  defaultRoute: getDefaultRoute(landingModule),
  landingModule,
}))(Content);
