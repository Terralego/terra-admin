import { connectAuthProvider } from '@terralego/core/modules/Auth';
import { connectAppProvider } from '../components/AppProvider';

const permissionsGetter = ({ user }) => (user ? { permissions: user.permissions } : {});
export const withPermissions = connectAuthProvider(permissionsGetter);

const enabledModulesGetter = ({ user }) => (user ? { enabled_modules: user.modules } : {});
export const withEnabledModules = connectAppProvider(enabledModulesGetter);

export default {
  withEnabledModules,
  withPermissions,
};
