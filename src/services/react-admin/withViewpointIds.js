import { GET_ONE } from 'react-admin';

import { RES_VIEWPOINT } from '../../modules/RA/ra-modules';

const withViewpointIds = dataProvider => async (type, resource, params, meta) => {
  if (type === GET_ONE && resource === RES_VIEWPOINT) {
    const response = await dataProvider(type, resource, params, meta);

    if (Array.isArray(response.data.pictures)) {
      response.data.picture_ids = response.data.pictures.map(({ id }) => id);
    }
    return response;
  }

  /**
   * Continue to next dataProvider
   */
  return dataProvider(type, resource, params, meta);
};

export default withViewpointIds;
