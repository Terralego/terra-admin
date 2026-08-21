import { GET_LIST, GET_MANY, GET_ONE } from 'react-admin';

import { RES_EXTENT } from '../../modules/RA/ra-modules';

export const fromApi = record => {
  const {
    id,
    name,
    category,
    pictogram,
    adapts_to_theme: adaptsToTheme,
    minLat, minLon, maxLat, maxLon,
  } = record;

  return {
    id,
    name,
    category,
    icon: pictogram,
    adaptToTheme: Boolean(adaptsToTheme),
    bbox: [minLon, minLat, maxLon, maxLat].map(Number),
  };
};

const patchExtentDataProvider = nextDataProvider => async (...args) => {
  const [type, resource] = args;
  const response = await nextDataProvider(...args);

  if (resource !== RES_EXTENT) return response;

  if ([GET_LIST, GET_MANY].includes(type)) {
    return { ...response, data: (response.data || []).map(fromApi) };
  }

  if (type === GET_ONE) {
    return { ...response, data: fromApi(response.data) };
  }

  return response;
};

export default patchExtentDataProvider;
