import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { connectCRUDProvider } from '../../../../services/CRUDProvider';
import compose from '../../../../../../utils/compose';

import AttachmentView from './AttachmentView';

const CRUDPRoviderGetter = ({
  attachmentCategories,
  getAttachmentCategories,
  getAttachment,
  settings: {
    config: {
      attachment_categories: attachmentCategoriesEndpoint,
    },
  },
  feature,
}, {
  match: { params: { id } },
}) => ({
  attachmentCategories,
  getAttachmentCategories,
  attachmentCategoriesEndpoint,
  getAttachment,
  feature: feature[id],
});

export default compose(
  withRouter,
  connectCRUDProvider(CRUDPRoviderGetter),
  withTranslation(),
)(AttachmentView);
