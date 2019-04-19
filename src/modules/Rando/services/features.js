import Api from 'mc-tf-test/modules/Api';

export async function fetchFeaturesList (layerId) {
  return Api.request(`layer/${layerId}/feature/`);
}

export async function fetchFeature (layerId, featureId) {
  return Api.request(`layer/${layerId}/feature/${featureId}/`);
}

export default { fetchFeaturesList, fetchFeature };
