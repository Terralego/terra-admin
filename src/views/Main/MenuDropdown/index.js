import { connectAuthProvider } from '@terralego/core/modules/Auth';
import { withTranslation } from 'react-i18next';
import { getComponentsByEnabledModules } from '../../../services/modules';
import { MenuDropdown } from './MenuDropdown';

import compose from '../../../utils/compose';
import { withEnabledModules } from '../../../hoc/withUserSettings';

const componentsToDisplay = ({ user: { modules } }) => ({
  modules: getComponentsByEnabledModules(modules),
});

export default compose(
  connectAuthProvider(componentsToDisplay),
  withTranslation(),
  withEnabledModules,
)(MenuDropdown);
