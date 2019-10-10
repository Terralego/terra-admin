import { CREATE, UPDATE } from 'react-admin';

import { RES_PICTURE } from '../../modules/RA/ra-modules';

const patchPictureDataProvider = dataProvider => async (type, resource, params, meta) => {
  /** Decorator to patch data to fix endpoint only issues */

  if ([CREATE, UPDATE].includes(type) && resource === RES_PICTURE) {
    // eslint-disable-next-line no-param-reassign
    params.data.date = new Date(params.data.date).toISOString();
  }
  /**
   * Continue to next dataProvider
   */
  return dataProvider(type, resource, params, meta);
};

export default patchPictureDataProvider;
