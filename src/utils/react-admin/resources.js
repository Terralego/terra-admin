import userConfig from '../../modules/User/config';
import userGroupConfig from '../../modules/UserGroup/config';
import dataSourceConfig  from '../../modules/DataSource/config';
import dataLayerConfig  from '../../modules/DataLayer/config';

/**
 * Remove the base path if it exists
 *
 * @example
 * getResourceWithoutBasePath('foo/bar')
 * // returns 'bar'
 * @example
 * getResourceWithoutBasePath('foo/bar/')
 * // returns 'bar'
 * @example
 * getResourceWithoutBasePath('foobar')
 * // returns 'foobar'
 *
 * @param {string} [string=''] Resource fullname
 * @returns {string}
 */
export const getResourceWithoutBasePath = (string = '') => (
  string.includes('/')
    /*
               🡆 'a//b/c/'
        split  🡆 ['a', undefined, 'b', 'c', undefined]
        filter 🡆 ['a', 'b', 'c']
        pop    🡆 'c'
    */
    ? string.split('/').filter(Boolean).pop()
    : string
);

/**
 * Return the fullname of a resource,
 * by prefixing with path, but without leading "/"
 *
 * @param {Object} config
 * @param {string} config.path The path prefix used for this resource
 * @param {string} config.resource The proper resource name
 * @returns {string} The resource fullname
 */
export const getResourceFullname = ({ resource }) => resource;

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
  getResourceWithoutBasePath,
  getResourceFullname,
  getEndpoint,
};
