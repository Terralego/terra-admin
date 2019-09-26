
import { connectAuthProvider } from '@terralego/core/modules/Auth';

import CellRender from './CellRender';

export default connectAuthProvider(({
  authenticated,
  user,
}) => {
  const permissions = authenticated ? user.permissions : [];
  return {
    displayViewFeature: permissions.includes('geostore.view_feature'),
    displayUpdateFeature: permissions.includes('geostore.change_feature'),
  };
})(CellRender);
