import { withNamespaces } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { connectAppProvider } from '../../../components/AppProvider';
import { getComponentsByEnabledModules } from '../../../services/modules';
import { MenuDropdown } from './MenuDropdown';

const componentsToDisplay = ({ env: { enabled_modules: modules } }) => ({
  modules: getComponentsByEnabledModules(modules),
});

export default withRouter(
  connectAppProvider(componentsToDisplay)(
    withNamespaces()(MenuDropdown),
  ),
);
