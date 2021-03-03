import { getEndpoint, getIdKey } from '../../utils/react-admin/resources';

const withResourceEndpoint = dataProvider => async (type, resource, params, meta) => {
  const newMeta = {
    ...meta,
    endpoint: getEndpoint(resource),
    id: getIdKey(resource),
  };

  /**
   * Continue to next dataProvider
   */
  return dataProvider(type, resource, params, newMeta);
};

export default withResourceEndpoint;
