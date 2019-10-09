import { CREATE, UPDATE } from 'react-admin';
import Api from '@terralego/core/modules/Api';

import { RES_DATASOURCE, RES_PICTURE } from '../../modules/RA/ra-modules';


const toMultipart = nextDataProvider => async (...args) => {
  const [type, resource, params, meta = {}] = args;
  const { endpoint = resource } = meta;

  /**
   * Manage file upload by converting query content to FormData()
   */
  if ([CREATE, UPDATE].includes(type) && [RES_DATASOURCE, RES_PICTURE].includes(resource)) {
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
      case CREATE:
        response = await Api.request(`${endpoint}/`, { method: 'POST', body });
        return { data: response, id: response.id };

      case UPDATE:
        response = await Api.request(`${endpoint}/${params.id}/`, { method: 'PATCH', body });
        return { data: response };

      default:
    }
  }

  /**
   * At least return initial data provider
   */
  return nextDataProvider(type, resource, params, meta);
};

export default toMultipart;
