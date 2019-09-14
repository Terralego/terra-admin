import Api from '@terralego/core/modules/Api';
import { WMTS } from '../../modules/RA/DataSource';
import { getEndpoint } from '../../utils/react-admin/resources';

import { RES_DATASOURCE } from '../../modules/RA/ra-modules';

const enhanceDataProvider = mainDataProvider => async (...args) => {
  const [type, resource, params] = args;

  const endpoint = getEndpoint(resource);

  // Manage custom query type
  if (type === 'REFRESH') {
    return Api.request(`${endpoint}/${params.id}/refresh/`);
  }

  if (type === 'CREATE' && resource === RES_DATASOURCE) {
    const { _type: sourceType } = params.data;
    if (sourceType === WMTS) {
      params.data.geom_type = 7;
    }
  }

  if (['CREATE', 'UPDATE'].includes(type) && resource === RES_DATASOURCE) {
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
        return { data: response, id: response.id };

      case 'UPDATE':
        response = await Api.request(`${endpoint}/${params.id}/`, { method: 'PATCH', body });
        return { data: response };

      default:
    }
  }

  return mainDataProvider(type, endpoint, params);
};

export default enhanceDataProvider;
