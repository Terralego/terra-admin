import { withRouter } from 'react-router';
import { withNamespaces } from 'react-i18next';
import { connectAuthProvider } from '@terralego/core/modules/Auth';

import Header from './Header';

export default connectAuthProvider(({
  authenticated,
  user,
}) => {
  const permissions = authenticated ? user.permissions : [];
  return {
    displayAddFeature: permissions.includes('terra.add_feature'),
  };
})(
  withNamespaces()(
    withRouter(Header),
  ),
);
