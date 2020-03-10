import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { connectAppProvider } from '../../../../../../components/AppProvider';
import { connectCRUDProvider } from '../../../../services/CRUDProvider';
import { getView } from '../../../../services/CRUD';

import Edit from './Edit';

import compose from '../../../../../../utils/compose';

const appProviderGetter = ({
  env: { modules: { CRUD: { settings } } },
}) => ({
  settingsEndpoint: settings,
});

const CRUDPRoviderGetter = ({
  getSettings,
  settings,
  saveFeature,
  errors: {
    feature: featureError,
  },
}, {
  match: { params: { layer, id } },
}) => ({
  featureError: featureError.find(({ featureId }) => featureId === id),
  getSettings,
  saveFeature,
  view: getView(settings, layer),
});

export default compose(
  withRouter,
  connectAppProvider(appProviderGetter),
  connectCRUDProvider(CRUDPRoviderGetter),
  withTranslation(),
)(Edit);
