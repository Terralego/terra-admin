import { withRouter } from 'react-router-dom';
import { withNamespaces } from 'react-i18next';
import { connectAuthProvider } from '@terralego/core/modules/Auth';

import { connectAppProvider } from '../../../../components/AppProvider';
import { connectCRUDProvider } from '../../services/CRUDProvider';
import compose from '../../../../utils/compose';

import Map from './Map';

const appProviderGetter = ({
  env: {
    modules: { CRUD: { settings } },
    BASE_LAYERS,
  },
}) => ({
  settingsEndpoint: settings,
  backgroundStyle: BASE_LAYERS.map(style => {
    const [label] = Object.keys(style);
    return {
      label,
      url: style[label].url,
    };
  }),
});

const authProviderGetter = ({
  authenticated,
  user,
}) => {
  const permissions = authenticated ? user.permissions : [];
  return {
    displayViewFeature: permissions.includes('can_view_feature'),
  };
};

const CRUDPRoviderGetter = ({
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
  connectAppProvider(appProviderGetter),
  connectAuthProvider(authProviderGetter),
  connectCRUDProvider(CRUDPRoviderGetter),
  withNamespaces(),
)(Map);
