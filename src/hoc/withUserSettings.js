import { connectAuthProvider } from '@terralego/core/modules/Auth';

const permissionsGetter = ({ user }) => (user ? { permissions: user.permissions } : {});
export const withPermissions = connectAuthProvider(permissionsGetter);

export default {
  withPermissions,
};
