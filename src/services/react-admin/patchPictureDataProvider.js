import { GET_ONE, CREATE, UPDATE } from 'react-admin';
import Api from '@terralego/core/modules/Api';

import { RES_PICTURE } from '../../modules/RA/ra-modules';


async function updatePictureFile ({ rawFile, id, ...rest }) {
  // To be modified to upload picture
  const formData = new FormData();

  formData.append('file', rawFile);
  if (id) {
    return Api.request(`picture/${id}`, { method: 'POST', body: formData });
  }
  return Api.request('picture/', { method: 'POST', body: formData });
}

const patchPictureDataProvider = dataProvider => async (type, resource, params, meta) => {
  /** Decorator to patch data to fix endpoint only issues */

  console.log(type, resource, params, RES_PICTURE);
  if (type === UPDATE && resource === 'pictures') {
    // Here call updatePictureFile
    // Need to step update i think
  }
  /**
   * Continue to next dataProvider
   */
  return dataProvider(type, resource, params, meta);
};

export default patchPictureDataProvider;
