import { connectAuthProvider } from '@terralego/core/modules/Auth';
import Map from './Map';


const authProviderGetter = ({
  authenticated,
  user,
}) => {
  const permissions = authenticated ? user.permissions : [];
  return {
    displayViewFeature: permissions.includes('can_view_feature'),
  };
};

export default connectAuthProvider(authProviderGetter)(Map);
