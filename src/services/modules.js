import modules from '../modules';

/**
 * getComponentsByEnabledModules
 * @param {Array} selectedModules list of selectedModules
 * @returns {Array} modules components driven by the config enabled_modules
 */
export const getComponentsByEnabledModules = (selectedModules = []) =>
  Object.keys(modules).reduce((list, moduleName) => (
    selectedModules.includes(moduleName)
      ? [...list, modules[moduleName].default]
      : list
  ), []);

export default {
  getComponentsByEnabledModules,
};
