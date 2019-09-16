import Api from '@terralego/core/modules/Api';
import { WMTS } from '../../modules/RA/DataSource';

import { RES_DATASOURCE } from '../../modules/RA/ra-modules';

const enhanceDataProvider = nextDataProvider => async (...args) => {
  const [type, resource, params, meta = {}] = args;
  const { endpoint = resource } = meta;

  /**
   * Manage custom RESFRESH query type
  */
  if (type === 'REFRESH') {
    return Api.request(`${endpoint}/${params.id}/refresh/`);
  }

  /**
   * Force geom_type field for WMTS _type
   */
  if (type === 'CREATE' && resource === RES_DATASOURCE) {
    const { _type: sourceType } = params.data;
    if (sourceType === WMTS) {
      params.data.geom_type = 7;
    }
  }

  /**
   * Manage file upload by converting query content to FormData()
   */
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

  /**
   * At least return initial data provider
   */
  return nextDataProvider(type, endpoint, params);
};

export default enhanceDataProvider;
