import { connectAuthProvider } from '@terralego/core/modules/Auth';

const permissionsGetter = ({ user: { permissions = [] } }) => ({ permissions });
export const withPermissions = connectAuthProvider(permissionsGetter);

export default {
  withPermissions,
};
