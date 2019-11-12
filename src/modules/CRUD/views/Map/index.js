import { withRouter } from 'react-router-dom';
import { withNamespaces } from 'react-i18next';
import { connectAuthProvider } from '@terralego/core/modules/Auth';

import { connectAppProvider } from '../../../../components/AppProvider';
import { connectCRUDProvider } from '../../services/CRUDProvider';
import compose from '../../../../utils/compose';

import Map from './Map';

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
    displayViewFeature: permissions.includes('can_view_feature'),
  };
};

const CRUDPRovider = ({
  getSettings,
  settings,
  setMap,
  map,
  mapIsResizing,
  feature,
  errors,
}, {
  match: {
    params: {
      id,
    },
  },
}) => ({
  getSettings,
  settings,
  setMap,
  map,
  mapIsResizing,
  feature: feature[id] || {},
  errors,
});

export default compose(
  withRouter,
  connectAppProvider(appProvider),
  connectAuthProvider(authProvider),
  connectCRUDProvider(CRUDPRovider),
  withNamespaces(),
)(Map);
