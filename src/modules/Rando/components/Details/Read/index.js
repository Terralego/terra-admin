
import { withRouter } from 'react-router';
import { withNamespaces } from 'react-i18next';
import { connectAuthProvider } from '@terralego/core/modules/Auth';

import Read from './Read';

export default connectAuthProvider(({
  user,
}) => {
  const { permissions = [] } = user;
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
