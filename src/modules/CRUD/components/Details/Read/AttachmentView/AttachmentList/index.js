import { withRouter } from 'react-router-dom';
import { connectCRUDProvider } from '../../../../../services/CRUDProvider';
import { getView } from '../../../../../services/CRUD';
import compose from '../../../../../../../utils/compose';

import AttachmentList from './AttachmentList';


const CRUDPRoviderGetter = ({
  fetchFeature,
  settings,
}, {
  match: { params: { layer } },
}) => {
  const { featureEndpoint } = getView(settings, layer);
  return {
    featureEndpoint,
    fetchFeature,
  };
};

export default compose(
  withRouter,
  connectCRUDProvider(CRUDPRoviderGetter),
)(AttachmentList);
