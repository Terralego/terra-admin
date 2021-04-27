import { CREATE, UPDATE, GET_ONE } from 'react-admin';

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
   * Split related file in two list
   */
  if (resource === 'viewpoints') {
    // And change file structure to feed react-admin
    if ([GET_ONE].includes(type)) {
      return nextDataProvider(type, resource, params, meta).then(toBeModified => {
        // eslint-disable-next-line no-param-reassign
        toBeModified.data.related_rephotography = toBeModified.data.related.filter(({ properties: { type: typeDoc = 'croquis' } }) =>
          ['croquis', 'emplacement'].includes(typeDoc)).map(doc => ({ ...doc, document: { url: doc.document } }));
        // eslint-disable-next-line no-param-reassign
        toBeModified.data.related_docs = toBeModified.data.related.filter(({ properties: { type: typeDoc = 'croquis' } }) =>
          ['doc'].includes(typeDoc)).map(doc => ({ ...doc, document: { url: doc.document } }));
        return toBeModified;
      });
    }

    /**
   * Merge the previously splited list and manage file upload by converting file to base64.
   */
    if ([CREATE, UPDATE].includes(type)) {
      // Merge list and delete extra lists
      let newRelated = [];
      if (params.data.related_rephotography) {
        newRelated = [...params.data.related_rephotography];
      }
      if (params.data.related_docs) {
        newRelated = [...newRelated, ...params.data.related_docs];
      }
      params.data.related = newRelated.map(
        doc => ({ ...doc, rawFile: doc?.document?.rawFile }),
      );
      delete params.data.related_rephotography;
      delete params.data.related_docs;
      // Handle base64 transformation is necessary
      if (params.data.related) {
        await Promise.all(params.data.related.map(async (doc, index) => {
          if (doc.rawFile) {
            params.data.related[index].document = await convertFileToBase64(doc);
          } else {
            delete params.data.related[index].document;
          }
        }));
      }
    }
  }

  /**
   * At least return initial data provider
   */
  return nextDataProvider(type, endpoint, params);
};

export default enhanceDataProvider;
