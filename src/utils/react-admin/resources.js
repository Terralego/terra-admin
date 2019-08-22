/**
 * Return the fullname of a resource,
 * by prefixing with path, but without leading "/"
 *
 * @param {Object} config
 * @param {string} config.path The path prefix used for this resource
 * @param {string} config.resource The proper resource name
 * @returns {string} The resource fullname
 */
export const getResourceFullname = ({ path, resource }) =>
  `${path}/${resource}`.replace(/^\//g, '');

export default {
  getResourceFullname,
};
