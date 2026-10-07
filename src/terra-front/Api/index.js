import Api from './api';

export * from './api';

export const ApiProvider = ({ host, children }) => {
  Api.host = host;
  return children;
};

export default Api;
