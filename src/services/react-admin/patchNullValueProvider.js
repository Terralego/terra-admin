import { CREATE, UPDATE } from 'react-admin';

import { RES_DATALAYER } from '../../modules/RA/ra-modules';

/**
 * This dataprovider patch null values to avoid error while saving text property
 * with null instead of empty text.
 * See https://marmelab.com/react-admin/CreateEdit.html#setting-empty-values-to-null
 */
const patchNullValuesDataProvider = dataProvider => async (type, resource, params, meta) => {
  /* eslint-disable no-param-reassign */
  if ([CREATE, UPDATE].includes(type) && resource === RES_DATALAYER) {
    // eslint-disable-next-line no-param-reassign
    params.data.description = params.data.description || '';
    params.data.source_filter = params.data.source_filter || '';
  }
  /* eslint-enable no-param-reassign */

  /**
   * Continue to next dataProvider
   */
  return dataProvider(type, resource, params, meta);
};

export default patchNullValuesDataProvider;
