import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { connectCRUDProvider } from '../../../../../services/CRUDProvider';
import compose from '../../../../../../../utils/compose';
import { getView } from '../../../../../services/CRUD';

import ImportFile from './ImportFile';

const CRUDPRoviderGetter = ({
  fetchFeature,
  settings: {
    config: {
      default: {
        FILE_UPLOAD_MAX_MEMORY_SIZE: maxFileSize,
        IMAGE_EXTENSION_ALLOWED: imageAllowedFileTypes,
      },
    },
  },
  findOrCreateAttachmentCategory,
  feature,
  settings,
}, {
  match: { params: { id, layer } },
}) => {
  const { featureEndpoint } = getView(settings, layer);
  return {
    findOrCreateAttachmentCategory,
    feature: feature[id],
    featureEndpoint,
    fetchFeature,
    imageAllowedFileTypes,
    fileAllowedFileTypes: null,
    maxFileSize: typeof maxFileSize === 'number' ? maxFileSize * 8 : null, // `* 8` is the conversion from bytes to bits
  };
};

export default compose(
  withRouter,
  withTranslation(),
  connectCRUDProvider(CRUDPRoviderGetter),
)(ImportFile);
