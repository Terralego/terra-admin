import { GET_ONE } from 'react-admin';

import { RES_VIEW } from '../../modules/RA/ra-modules';

/**
 * Transform the response from backend api
 * @param dataProvider
 * @returns {Function}
 */
const patchSceneDataProvider = dataProvider => async (type, resource, params, meta) => {
  /** Decorator to patch data to fix type for component ImageInput in react-admin */

  const response = await dataProvider(type, resource, params, meta);
  if (type === GET_ONE && resource === RES_VIEW) {
    return {
      data: {
        ...response.data,
        custom_icon: {
          url: response.data.custom_icon,
        },
      },
    };
  }
  return response;
};

export default patchSceneDataProvider;
