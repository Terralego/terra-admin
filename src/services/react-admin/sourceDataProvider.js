import { CREATE } from 'react-admin';
import Api from '@terralego/core/modules/Api';
import { WMTS } from '../../modules/RA/DataSource';

import { RES_DATASOURCE } from '../../modules/RA/ra-modules';

const REFRESH = 'REFRESH';
const PROPERTY_VALUES = 'PROPERTY_VALUES';

const enhanceDataProvider = nextDataProvider => async (...args) => {
  const [type, resource, params, meta = {}] = args;
  const { endpoint = resource } = meta;

  /**
   * Manage custom REFRESH query type
   */
  if (type === REFRESH) {
    return Api.request(`${endpoint}/${params.id}/refresh/`);
  }

  /**
   * Manage custom PROPERTY_VALUES query type
   */
  if (type === PROPERTY_VALUES) {
    const { property, id } = params;
    return Api.request(`${endpoint}/${id}/property_values/?property=${property}`);
  }

  /**
   * Force geom_type field for WMTS _type
   */
  if (type === CREATE && resource === RES_DATASOURCE) {
    const { _type: sourceType } = params.data;
    if (sourceType === WMTS) {
      params.data.geom_type = 7;
    }
  }


  /**
   * At least return initial data provider
   */
  return nextDataProvider(type, endpoint, params);
};

export default enhanceDataProvider;
