import { withRouter } from 'react-router-dom';
import { withNamespaces } from 'react-i18next';
import { connectAuthProvider } from '@terralego/core/modules/Auth';
import { connectCRUDProvider } from '../../../services/CRUDProvider';
import { withTableSize } from '../../../services/UserSettingsProvider';
import compose from '../../../../../utils/compose';

import Header from './Header';

const authProviderGetter = ({
  authenticated,
  user,
}) => {
  const permissions = authenticated ? user.permissions : [];
  return {
    displayAddFeature: permissions.includes('can_add_feature'),
  };
};

export default compose(
  withRouter,
  connectAuthProvider(authProviderGetter),
  connectCRUDProvider('featuresList'),
  withTableSize(),
  withNamespaces(),
)(Header);
