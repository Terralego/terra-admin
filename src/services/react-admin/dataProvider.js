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

export default async (...args) => {
  const [type, resource, params] = args;

  // Manage custom query type
  if (type === 'REFRESH') {
    return Api.request(`${resource}/${params.id}/refresh/`);
  }

  // Manage file upload
  if (['CREATE', 'UPDATE'].includes(type) && resource === 'geosource') {
    const body = new FormData();

    Object.keys(params.data).forEach(key => {
      if (key === 'file') { return; }

      const value = typeof params.data[key] === 'object'
        ? JSON.stringify(params.data[key])
        : params.data[key];

      body.append(key, value);
    });

    if (params.data.file && params.data.file.rawFile) {
      body.append('file', params.data.file.rawFile);
    }

    let response;

    switch (type) {
      case 'CREATE':
        response = await Api.request('geosource/', { method: 'POST', body });
        break;

      case 'UPDATE':
        response = await Api.request(`geosource/${params.id}/`, { method: 'PATCH', body });
        break;
      default:
    }

    switch (type) {
      case 'CREATE':
        return { data: response, id: response.id };
      default:
        return { data: response };
    }
  }

  return drfProvider(Api.host, httpClient)(...args);
};
