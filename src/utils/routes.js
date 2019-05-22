import pathToRegexp from 'path-to-regexp';

export const generateURIFactory = routes => (name, params) => {
  const { path } = routes.find(route => route.name === name) || {};
  if (!path) {
    return false;
  }
  const toPath = pathToRegexp.compile(path);
  return toPath(params);
};

export default { generateURIFactory };
