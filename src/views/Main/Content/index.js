import { connectAuthProvider } from '@terralego/core/modules/Auth';
import { connectAppProvider } from '../../../components/AppProvider';

import { Content } from './Content';
import { getComponentsByEnabledModules } from '../../../services/modules';
import compose from '../../../utils/compose';


const getDefaultRoute = landingModule => {
  const [{ config: { path = '' } = {} } = {}] = getComponentsByEnabledModules([landingModule]);
  return path;
};

const setLandingModule = ({
  env: { landing_module: landingModule },
}) => ({
  defaultRoute: getDefaultRoute(landingModule),
  landingModule,
});

const componentsToDisplay = ({ user }) => {
  if (user) {
    const { modules } = user;
    return { modules: getComponentsByEnabledModules(modules) };
  }
  return { modules: [] };
};

export default compose(
  connectAppProvider(setLandingModule),
  connectAuthProvider(componentsToDisplay),
)(Content);
