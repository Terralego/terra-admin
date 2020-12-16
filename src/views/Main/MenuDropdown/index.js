import { withTranslation } from 'react-i18next';
import { connectAppProvider } from '../../../components/AppProvider';
import { getComponentsByEnabledModules } from '../../../services/modules';
import { MenuDropdown } from './MenuDropdown';

import compose from '../../../utils/compose';
import { withEnabledModules } from '../../../hoc/withUserSettings';

const componentsToDisplay = ({ env: { enabled_modules: modules } }) => ({
  modules: getComponentsByEnabledModules(modules),
});

export default compose(
  connectAppProvider(componentsToDisplay),
  withTranslation(),
  withEnabledModules,
)(MenuDropdown);
