import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { connectAuthProvider } from '@terralego/core/modules/Auth';

import { connectAppProvider } from '../../../../../components/AppProvider';
import { connectCRUDProvider } from '../../../services/CRUDProvider';
import { getView } from '../../../services/CRUD';
import compose from '../../../../../utils/compose';

import Create from './Create';

const appProviderGetter = ({
  env: { modules: { CRUD: { settings } } },
}) => ({
  settingsEndpoint: settings,
});

const authProviderGetter = ({
  authenticated,
  user,
}) => {
  const permissions = authenticated ? user.permissions : [];
  return {
    displayAddFeature: permissions.includes('can_add_feature'),
    displayChangeFeature: permissions.includes('can_change_feature'),
  };
};

const CRUDPRoviderGetter = ({
  errors: {
    feature,
  },
  settings,
  saveFeature,
}, {
  match: { params: { layer } },
}) => ({
  featureError: feature[0],
  saveFeature,
  view: getView(settings, layer),
});

export default compose(
  withRouter,
  connectAppProvider(appProviderGetter),
  connectAuthProvider(authProviderGetter),
  connectCRUDProvider(CRUDPRoviderGetter),
  withTranslation(),
)(Create);
