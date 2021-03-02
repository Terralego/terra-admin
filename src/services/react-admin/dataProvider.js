import drfProvider from 'ra-data-drf';
import { fetchUtils } from 'react-admin';
import Api from '@terralego/core/modules/Api';
import auth from '@terralego/core/modules/Auth/services/auth';

const httpClient = (url, options = {}) =>
  fetchUtils.fetchJson(url, {
    user: {
      authenticated: true,
      token: `JWT ${auth.getToken()}`,
    },
    ...options,
  });

export default (...args) => {
  const idKey = args.slice(-1)?.id;
  return drfProvider(Api.host, httpClient, idKey)(...args);
};
