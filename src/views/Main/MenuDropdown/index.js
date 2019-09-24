import { withNamespaces } from 'react-i18next';
import { connectAppProvider } from '../../../components/AppProvider';
import { getComponentsByEnabledModules } from '../../../services/modules';
import { MenuDropdown } from './MenuDropdown';

import compose from '../../../utils/compose';

const componentsToDisplay = ({ env: { enabled_modules: modules } }) => ({
  modules: getComponentsByEnabledModules(modules),
});

export default compose(
  connectAppProvider(componentsToDisplay),
  withNamespaces(),
)(MenuDropdown);
