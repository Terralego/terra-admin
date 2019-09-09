import Api from '@terralego/core/modules/Api';

export const fetchFeaturesList = async layerId => {
  if (!layerId) {
    return { error: { layerId, message: 'Layer ID is missing' } };
  }
  try {
    const { results: featuresList } = await Api.request(`layer/${layerId}/feature/`);
    return { featuresList };
  } catch (e) {
    return { error: { layerId, message: e.message } };
  }
};

export const fetchFeature = async (layerId, featureId) => {
  if (!layerId || !featureId) {
    return { error: { layerId, featureId, message: 'Layer ID or Feature ID are missing' } };
  }
  try {
    const feature = await Api.request(`layer/${layerId}/feature/${featureId}/`);
    return { feature };
  } catch (e) {
    return { error: { layerId, featureId, message: e.message } };
  }
};

const createFeature = async (layerId, body) => {
  if (!layerId) {
    return { error: { layerId, message: 'Layer ID is missing' } };
  }
  try {
    const feature = await Api.request(`layer/${layerId}/feature/`, { method: 'POST', body });
    return { feature };
  } catch (e) {
    return { error: { layerId, message: e.message } };
  }
};

const updateFeature = async (layerId, featureId, body) => {
  try {
    const feature = await Api.request(`layer/${layerId}/feature/${featureId}/`, { method: 'PUT', body });
    return { feature };
  } catch (e) {
    return { error: { layerId, featureId, message: e.message } };
  }
};

export const deleteFeature = async (layerId, featureId) => {
  if (!layerId || !featureId) {
    return { error: { layerId, featureId, message: 'Layer ID or feature ID are missing' } };
  }
  try {
    await Api.request(`layer/${layerId}/feature/${featureId}/`, { method: 'DELETE' });
    return { feature: featureId };
  } catch (e) {
    return { error: { layerId, featureId, message: e.message } };
  }
};

export const saveFeature = (layerId, featureId, body) => (
  featureId
    ? updateFeature(layerId, featureId, body)
    : createFeature(layerId, body)
);

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


export default { fetchFeaturesList, fetchFeature, deleteFeature, saveFeature, getBounds };
