
import { withRouter } from 'react-router';
import { withNamespaces } from 'react-i18next';
import { connectAuthProvider } from '@terralego/core/modules/Auth';

import Read from './Read';

export default connectAuthProvider(({
  authenticated,
  user,
}) => {
  const permissions = authenticated ? user.permissions : [];
  return {
    displayViewFeature: permissions.includes('terra.view_feature'),
  };
})(
  withRouter(
    withNamespaces()(
      Read,
    ),
  ),
);
