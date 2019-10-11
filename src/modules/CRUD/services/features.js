import Api from '@terralego/core/modules/Api';

export const fetchFeaturesList = layerId =>
  Api.request(`crud/layer/${layerId}/features/?page_size=2000`);

export const fetchFeature = (layerId, featureId) =>
  Api.request(`crud/layer/${layerId}/features/${featureId}/`);

const createFeature = (layerId, body) =>
  Api.request(`crud/layer/${layerId}/features/`, { method: 'POST', body });

const updateFeature = (layerId, featureId, body) =>
  Api.request(`crud/layer/${layerId}/features/${featureId}/`, { method: 'PUT', body });

export const deleteFeature = (layerId, featureId) =>
  Api.request(`crud/layer/${layerId}/features/${featureId}/`, { method: 'DELETE' });

export const saveFeature = (layerId, featureId, body) => (
  featureId
    ? updateFeature(layerId, featureId, body)
    : createFeature(layerId, body)
);

export const updateOrSaveFeatureInFeaturesList = (featuresList, feature) => {
  const isFeatureAlreadyExisting = featuresList.some(({ identifier }) => (
    identifier === feature.identifier
  ));

  return isFeatureAlreadyExisting
    ? featuresList.map(item => (item.identifier === feature.identifier ? feature : item))
    : [...featuresList, feature.identifier && feature].filter(Boolean);
};

export const updateFeatureIdentifier = (feature, newFeature) => ({
  ...feature,
  ...(newFeature.identifier
    ? { [newFeature.identifier]: newFeature }
    : {}
  ),
});

const getBoundingBox = (list, item) => {
  const [
    [minLng, minLat],
    [maxLng, maxLat],
  ] = list;

  const [lng, lat] = item;

  return [
    [Math.min(minLng, lng), Math.min(minLat, lat)],
    [Math.max(maxLng, lng), Math.max(maxLat, lat)],
  ];
};

export const getBounds = (coordinates, limits = [[Infinity, Infinity], [-Infinity, -Infinity]]) => {
  if (!Array.isArray(coordinates[0])) {
    return getBoundingBox(limits, coordinates);
  }
  return coordinates.reduce((list, coordinate) => {
    if (!Array.isArray(coordinate[0])) {
      return getBoundingBox(list, coordinate);
    }
    return getBounds(coordinate, list);
  }, limits);
};


export default {
  fetchFeaturesList,
  fetchFeature,
  deleteFeature,
  saveFeature,
  getBounds,
  updateOrSaveFeatureInFeaturesList,
  updateFeatureIdentifier,
};
