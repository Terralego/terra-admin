import Api from 'mc-tf-test/modules/Api';

export async function fetchFeature (layerId, featureId) {
  return Api.request(`layer/${layerId}/feature/${featureId}/`);
}

export default { fetchFeature };
