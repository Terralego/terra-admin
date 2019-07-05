
import { connectAuthProvider } from '@terralego/core/modules/Auth';

import CellRender from './CellRender';

export default connectAuthProvider(({
  user,
}) => {
  const { permissions = [] } = user;
  return {
    displayViewFeature: permissions.includes('terra.view_feature'),
    displayUpdateFeature: permissions.includes('terra.change_feature'),
  };
})(CellRender);
