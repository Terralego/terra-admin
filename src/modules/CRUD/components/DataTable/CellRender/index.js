
import { connectAuthProvider } from '@terralego/core/modules/Auth';

import CellRender from './CellRender';

export default connectAuthProvider(({
  authenticated,
  user,
}) => {
  const permissions = authenticated ? user.permissions : [];
  return {
    displayViewFeature: permissions.includes('terra_geocrud.can_view_feature'),
    displayUpdateFeature: permissions.includes('terra_geocrud.can_change_feature'),
  };
})(CellRender);
