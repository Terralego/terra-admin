import { connectCRUDProvider } from '../../../../../services/CRUDProvider';
import compose from '../../../../../../../utils/compose';

import AttachmentList from './AttachmentList';


export default compose(
  connectCRUDProvider('fetchFeature', 'settings'),
)(AttachmentList);
