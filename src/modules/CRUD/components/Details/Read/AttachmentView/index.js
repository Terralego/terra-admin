import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import compose from '../../../../../../utils/compose';

import AttachmentView from './AttachmentView';

export default compose(
  withRouter,
  withTranslation(),
)(AttachmentView);
