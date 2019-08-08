/**
 * Remove the base path if it exists
 * example:
 * 'foo/bar' returns 'bar'
 * 'foobar' returns 'foobar'
 * @param {string} string
 * @returns {string}
 */
export function getResourceWithoutBasePath (string) {
  if (!string.includes('/')) {
    return string;
  }
  return string.split('/').reverse()[0];
}

export default {
  getResourceWithoutBasePath,
};
