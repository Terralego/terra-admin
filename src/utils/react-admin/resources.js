import { resources as allConfig } from '../../modules/RA/ra-modules';

/**
 * Return the endpoint of specified resource
 *
 * @example
 * getEndpoint('user')
 * // returns 'custom/endpoint'
 *
 * @param {string} resource The resource name
 * @returns {string} The endpoint of specified resource
 */
export const getEndpoint = resource => {
  const currentConfig = allConfig.find(config => (config.name === resource));
  if (currentConfig && currentConfig.endpoint) {
    return currentConfig.endpoint;
  }

  return resource;
};

/**
 * Return the id key of a specified resource
 *
 * @example
 * getIdKey('viewpoint')
 * // returns 'identifier'
 *
 * @param {string} resource the resource name
 * @returns {?string} The id key of the specified rsource
 */
export const getIdKey = resource => {
  const currentConfig = allConfig.find(config => (config.name === resource));
  return currentConfig?.id;
};

export default {
  getEndpoint,
  getIdKey,
};
