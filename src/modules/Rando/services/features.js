import Api from '@terralego/core/modules/Api';

export async function fetchFeaturesList (layerId) {
  return Api.request(`layer/${layerId}/feature/`);
}

export async function fetchFeature (layerId, featureId) {
  return Api.request(`layer/${layerId}/feature/${featureId}/`);
}

export async function createFeature (layerId, body) {
  return Api.request(`layer/${layerId}/feature/`, { method: 'POST', body });
}

export async function updateFeature (layerId, featureId, body) {
  return Api.request(`layer/${layerId}/feature/${featureId}/`, { method: 'PUT', body });
}

export async function saveFeature (layerId, featureId = false, body) {
  if (featureId) {
    return updateFeature(layerId, featureId, body);
  }
  return createFeature(layerId, body);
}

function getBoundingBox (list, item) {
  const [lng, lat] = item;
  const [
    [minLng, minLat],
    [maxLng, maxLat],
  ] = list;
  return [
    [Math.min(minLng, lng), Math.min(minLat, lat)],
    [Math.max(maxLng, lng), Math.max(maxLat, lat)],
  ];
}

export function getBounds (coordinates, limits = [[Infinity, Infinity], [-Infinity, -Infinity]]) {
  if (!Array.isArray(coordinates[0])) {
    return getBoundingBox(limits, coordinates);
  }
  return coordinates.reduce((list, coordinate) => {
    if (!Array.isArray(coordinate[0])) {
      return getBoundingBox(list, coordinate);
    }
    return getBounds(coordinate, list);
  }, limits);
}


export default { fetchFeaturesList, fetchFeature, getBounds };
