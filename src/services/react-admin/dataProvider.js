import { fetchUtils } from 'react-admin';
import Api from '@terralego/core/modules/Api';
import auth from '@terralego/core/modules/Auth/services/auth';

import drfProvider from './drfProvider';

const httpClient = (url, options = {}) =>
  fetchUtils.fetchJson(url, {
    user: {
      authenticated: true,
      token: `JWT ${auth.getToken()}`,
    },
    ...options,
  });

export default (...args) => drfProvider(Api.host, httpClient)(...args);
