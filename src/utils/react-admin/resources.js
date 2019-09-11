import userConfig from '../../modules/RA/User/config';
import userGroupConfig from '../../modules/RA/UserGroup/config';
import dataSourceConfig  from '../../modules/RA/DataSource/config';
import dataLayerConfig  from '../../modules/RA/DataLayer/config';

export const allConfig = [
  userConfig,
  userGroupConfig,
  dataSourceConfig,
  dataLayerConfig,
];

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
  const currentConfig = allConfig.find(config => (config.resource === resource));

  if (currentConfig && currentConfig.endpoint) {
    return currentConfig.endpoint;
  }

  return resource;
};

export default {
  getEndpoint,
};
