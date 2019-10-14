
import { withRouter } from 'react-router-dom';
import { withNamespaces } from 'react-i18next';
import { connectAuthProvider } from '@terralego/core/modules/Auth';

import Read from './Read';

export default withRouter(
  connectAuthProvider(({
    authenticated,
    user,
  }) => {
    const permissions = authenticated ? user.permissions : [];
    return {
      displayViewFeature: permissions.includes('terra_geocrud.can_view_feature'),
    };
  })(
    withNamespaces()(
      Read,
    ),
  ),
);
