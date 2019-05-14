import { connectAppProvider } from '../../components/AppProvider';
import { Summary } from './Summary';
import { getModulesComponentsByPermissions } from '../../services/modules';

export default connectAppProvider(({ env: { permissions } }) => ({
  modules: getModulesComponentsByPermissions(permissions),
}))(Summary);
