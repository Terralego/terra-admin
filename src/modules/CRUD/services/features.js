import Api from '@terralego/core/modules/Api';

const sanitizeCustomEndpoint = str => {
  if (str.startsWith('/api/')) {
    return str.replace('/api/', '');
  }
  return str;
};

export const fetchFeaturesList = endpoint =>
  Api.request(`${sanitizeCustomEndpoint(endpoint)}?page_size=2000`);

export const fetchFeature = (endpoint, featureId) =>
  Api.request(`${sanitizeCustomEndpoint(endpoint)}/${featureId}/`);

const createFeature = (endpoint, body) =>
  Api.request(`${sanitizeCustomEndpoint(endpoint)}/`, { method: 'POST', body });

const updateFeature = (endpoint, featureId, body) =>
  Api.request(`${sanitizeCustomEndpoint(endpoint)}/${featureId}/`, { method: 'PUT', body });

export const deleteFeature = (endpoint, featureId) =>
  Api.request(`${sanitizeCustomEndpoint(endpoint)}/${featureId}/`, { method: 'DELETE' });

export const saveFeature = (endpoint, featureId, body) => (
  featureId
    ? updateFeature(endpoint, featureId, body)
    : createFeature(endpoint, body)
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
