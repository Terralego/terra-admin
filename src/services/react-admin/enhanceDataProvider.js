import { CREATE, UPDATE } from 'react-admin';

import { RES_VIEWPOINT } from '../../modules/RA/ra-modules';

const convertFileToBase64 = file => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file.rawFile);

  reader.onload = () => resolve(reader.result);
  reader.onerror = reject;
});

const enhanceDataProvider = nextDataProvider => async (...args) => {
  const [type, resource, params, meta = {}] = args;
  const { endpoint = resource } = meta;

  /**
   * Manage file upload by converting file to base64.
   */
  if ([CREATE, UPDATE].includes(type) && resource === RES_VIEWPOINT) {
    if (params.data.related) {
      await Promise.all(params.data.related.map(async (doc, index) => {
        if (doc.rawFile) {
          params.data.related[index].document = await convertFileToBase64(doc);
        }
      }));
    }
  }

  /**
   * At least return initial data provider
   */
  return nextDataProvider(type, endpoint, params, meta);
};

export default enhanceDataProvider;
