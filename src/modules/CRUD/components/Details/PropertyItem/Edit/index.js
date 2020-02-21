import { withRouter } from 'react-router-dom';
import { withNamespaces } from 'react-i18next';
import { connectCRUDProvider } from '../../../../services/CRUDProvider';
import { getView } from '../../../../services/CRUD';

import Edit from './Edit';

import compose from '../../../../../../utils/compose';

const CRUDPRoviderGetter = ({
  settings,
  feature,
  saveFeature,
  errors: {
    feature: featureError,
  },
}, {
  match: { params: { layer, id } },
}) => ({
  feature: feature[id] || {},
  saveFeature,
  view: getView(settings, layer),
  featureError: featureError.find(({ featureId }) => featureId === id),
});

export default compose(
  withRouter,
  connectCRUDProvider(CRUDPRoviderGetter),
  withNamespaces(),
)(Edit);
