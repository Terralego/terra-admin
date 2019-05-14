import { withNamespaces } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { connectAppProvider } from '../../../components/AppProvider';
import { getComponentsByEnabledModules } from '../../../services/modules';
import { MenuDropdown } from './MenuDropdown';

export default connectAppProvider(
  ({ env: { enabled_modules: modules } }) => ({ modules: getComponentsByEnabledModules(modules) }),
)(withNamespaces()(withRouter(MenuDropdown)));
