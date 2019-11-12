
import { connectAuthProvider } from '@terralego/core/modules/Auth';

import CellRender from './CellRender';

export default connectAuthProvider(({
  authenticated,
  user,
}) => {
  const permissions = authenticated ? user.permissions : [];
  return {
    displayViewFeature: permissions.includes('can_view_feature'),
    displayUpdateFeature: permissions.includes('can_change_feature'),
  };
})(CellRender);
