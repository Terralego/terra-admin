
import { connectAuthProvider } from '@terralego/core/modules/Auth';

import CellRender from './CellRender';

export default connectAuthProvider(({
  authenticated,
  user,
}) => {
  const permissions = authenticated ? user.permissions : [];
  return {
    displayViewFeature: permissions.includes('terra.view_feature'),
    displayUpdateFeature: permissions.includes('terra.change_feature'),
  };
})(CellRender);
