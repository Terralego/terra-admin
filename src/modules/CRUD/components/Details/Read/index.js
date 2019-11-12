
import { withRouter } from 'react-router-dom';
import { withNamespaces } from 'react-i18next';
import { connectAuthProvider } from '@terralego/core/modules/Auth';
import compose from '../../../../../utils/compose';

import Read from './Read';

const authProviderGetter = ({
  authenticated,
  user,
}) => {
  const permissions = authenticated ? user.permissions : [];
  return {
    displayViewFeature: permissions.includes('can_view_feature'),
  };
};

export default compose(
  withRouter,
  connectAuthProvider(authProviderGetter),
  withNamespaces(),
)(Read);
