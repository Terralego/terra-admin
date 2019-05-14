import modules from '../modules';

/**
 * getComponentsByEnabledModules
 * @param {Array} selectedModules list of selectedModules
 * @returns {Array} modules components driven by the config enabled_modules
 */
export const getComponentsByEnabledModules = (selectedModules = []) =>
  Object.values(modules).reduce((list, { default: module }) => (
    selectedModules.includes(module.name)
      ? [...list, module]
      : list
  ), []);

export default {
  getComponentsByEnabledModules,
};
