import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { connectCRUDProvider } from '../../../services/CRUDProvider';
import { withTableFilters } from '../../../services/UserSettingsProvider';
import { getView } from '../../../services/CRUD';
import compose from '../../../../../utils/compose';

import Search from './Search';

const CRUDPRoviderGetter = ({
  featuresList,
  getFeaturesList,
  settings,
}, {
  match: { params: { layer } },
}) => {
  const { featureEndpoint } = getView(settings, layer);
  return {
    featureEndpoint,
    featuresList,
    getFeaturesList,
  };
};

export default compose(
  withRouter,
  connectCRUDProvider(CRUDPRoviderGetter),
  withTableFilters(),
  withTranslation(),
)(Search);
