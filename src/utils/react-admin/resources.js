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
export const getResourceFullname = ({ path, resource }) =>
  `${path}/${resource}`.replace(/^\//g, '');

export default {
  getResourceWithoutBasePath,
  getResourceFullname,
};
