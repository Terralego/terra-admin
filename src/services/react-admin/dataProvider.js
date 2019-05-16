import drfProvider from 'ra-data-drf';
import Api from '@terralego/core/modules/Api';

export default (...args) => {
  const [queryType, resource, params] = args;

  // Manage custom query type
  if (queryType === 'REFRESH') {
    return fetch(`${Api.host}/${resource}/${params.id}/refresh/`);
  }

  return drfProvider(Api.host)(...args);
};
