import modules from '../modules';

/**
 * getModulesComponentsByPermissions
 * @param {Array} permissions list of permissions
 * @returns {Array} modules components filter by permissions
 */
export const getModulesComponentsByPermissions = (permissions = []) =>
  Object.values(modules)
    // .filter(({ default: { config: { permission } } }) => permissions.includes(permission))
    .map(({ default: Component }) => Component);

export default {
  getModulesComponentsByPermissions,
};
