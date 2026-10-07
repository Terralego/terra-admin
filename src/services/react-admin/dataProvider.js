import drfProvider from '@terralego/ra-data-drf';
import { fetchUtils } from 'react-admin';
import Api from '../../terra-front/Api';
import { getToken } from '../../terra-front/Auth/auth';

const httpClient = (url, options = {}) =>
  fetchUtils.fetchJson(url, {
    user: {
      authenticated: true,
      token: `JWT ${getToken()}`,
    },
    ...options,
  }).catch(e => {
    if (e.body !== undefined) {
      e.message = `Error: ${JSON.stringify(e.body)}`;
    }
    throw e;
  });

export default (...args) => drfProvider(Api.host, httpClient)(...args);
