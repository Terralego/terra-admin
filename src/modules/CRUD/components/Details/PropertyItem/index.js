import { connectAuthProvider } from '@terralego/core/modules/Auth';
import PropertyItem from './PropertyItem';

import compose from '../../../../../utils/compose';


const connectAuthProviderGetter = (({
  authenticated,
  user,
}) => {
  const permissions = authenticated ? user.permissions : [];
  return {
    canViewFeature: permissions.includes('can_view_feature'),
    canUpdateFeature: permissions.includes('can_change_feature'),
  };
});

export default compose(
  connectAuthProvider(connectAuthProviderGetter),
)(PropertyItem);
