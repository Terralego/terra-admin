import { connectAuthProvider } from '@terralego/core/modules/Auth';
import compose from '../utils/compose';
// eslint-disable-next-line camelcase
import { withEnabledModules_DEPRECATED } from './withAppSettings';

const permissionsGetter = ({ user }) => (user ? { permissions: user.permissions } : {});
export const withPermissions = connectAuthProvider(permissionsGetter);

const enabledModulesGetter = ({ user }) => (user ? { enabledModules: user.modules } : {});

export const withEnabledModules = compose(
  connectAuthProvider(enabledModulesGetter),
  withEnabledModules_DEPRECATED,
);


export default {
  withPermissions,
};
