import Api from '@terralego/core/modules/Api';
import { WMTS } from '../../modules/RA/DataSource';
import { getResourceWithoutBasePath, getEndpoint } from '../../utils/react-admin/resources';

const enhanceDataProvider = mainDataProvider => async (...args) => {
  const [type, resourceWithBasePath, params] = args;

  const resource = getResourceWithoutBasePath(resourceWithBasePath);
  const endpoint = getEndpoint(resource);

  // Manage custom query type
  if (type === 'REFRESH') {
    return Api.request(`${endpoint}/${params.id}/refresh/`);
  }

  if (type === 'CREATE' && resource === 'geosource') {
    const { _type: sourceType } = params.data;
    if (sourceType === WMTS) {
      params.data.geom_type = 7;
    }
  }

  // Manage file upload
  if (['CREATE', 'UPDATE'].includes(type) && resource === 'geosource') {
    const body = new FormData();

    Object.keys(params.data).forEach(key => {
      if (key === 'file') { return; }

      let value = params.data[key];

      if (typeof value === 'object') {
        value = JSON.stringify(value, null, 2);
      }

      body.append(key, value);
    });

    if (params.data.file && params.data.file.rawFile) {
      body.append('file', params.data.file.rawFile);
    }

    let response;

    switch (type) {
      case 'CREATE':
        response = await Api.request(`${endpoint}/`, { method: 'POST', body });
        break;

      case 'UPDATE':
        response = await Api.request(`${endpoint}/${params.id}/`, { method: 'PATCH', body });
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

  return mainDataProvider(type, endpoint, params);
};

export default enhanceDataProvider;
