import { connectAppProvider } from '../../components/AppProvider';
import Summary from './Summary';
import { getComponentsByEnabledModules } from '../../services/modules';

export default connectAppProvider(({ env: { enabled_modules: enabledModules } }) => ({
  modules: getComponentsByEnabledModules(enabledModules),
}))(Summary);
