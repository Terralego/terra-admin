import { connectAuthProvider } from '@terralego/core/modules/Auth';

const permissionsGetter = ({ user }) => (user ? { permissions: user.permissions } : {});
export const withPermissions = connectAuthProvider(permissionsGetter);

const enabledModulesGetter = ({ user }) => (user ? { enabled_modules: user.modules } : {});
export const withEnabledModules = connectAuthProvider(enabledModulesGetter);

export default {
  withEnabledModules,
  withPermissions,
};
