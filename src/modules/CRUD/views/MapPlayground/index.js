import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { connectAuthProvider } from '@terralego/core/modules/Auth';

import { connectAppProvider } from '../../../../components/AppProvider';
import { connectCRUDProvider } from '../../services/CRUDProvider';
import { withTableSize } from '../../services/UserSettingsProvider';
import { connectMapProvider } from '../../services/MapProvider';
import compose from '../../../../utils/compose';

import MapPlayground from './MapPlayground';

const appProviderGetter = ({
  env: {
    modules: { CRUD: { settings } },
  },
}) => ({
  settingsEndpoint: settings,
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
  feature: feature[id] || {},
  errors,
  backgroundStyle: settings?.config?.BASE_LAYERS?.map(style => {
    const [label] = Object.keys(style);
    return {
      label,
      url: style[label].url,
    };
  }),
});

export default compose(
  withRouter,
  connectAppProvider(appProviderGetter),
  connectAuthProvider(authProviderGetter),
  connectCRUDProvider(CRUDPRoviderGetter),
  connectMapProvider('addControl', 'controls', 'dataTableRef', 'detailsRef', 'map', 'removeControl', 'setFitBounds', 'setMap'),
  withTableSize(),
  withTranslation(),
)(MapPlayground);
