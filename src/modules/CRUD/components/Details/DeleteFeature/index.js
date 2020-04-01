import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { connectAuthProvider } from '@terralego/core/modules/Auth';

import { connectAppProvider } from '../../../../../components/AppProvider';
import { connectCRUDProvider } from '../../../services/CRUDProvider';
import { getView } from '../../../services/CRUD';
import compose from '../../../../../utils/compose';

import DeleteFeature from './DeleteFeature';

const appProvider = ({
  env: { modules: { CRUD: { settings } } },
}) => ({
  settingsEndpoint: settings,
});

const authProvider = ({
  authenticated,
  user,
}) => {
  const permissions = authenticated ? user.permissions : [];
  return {
    displayDelete: permissions.includes('can_delete_feature'),
  };
};

const CRUDPRovider = ({
  feature,
  getSettings,
  settings,
  deleteFeature,
}, {
  match: { params: { id, layer } },
}) => ({
  feature: feature[id],
  getSettings,
  deleteFeature,
  view: getView(settings, layer),
});

export default compose(
  withRouter,
  connectAppProvider(appProvider),
  connectAuthProvider(authProvider),
  connectCRUDProvider(CRUDPRovider),
  withTranslation(),
)(DeleteFeature);
