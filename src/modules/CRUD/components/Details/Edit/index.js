import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { connectAuthProvider } from '@terralego/core/modules/Auth';

import { connectAppProvider } from '../../../../../components/AppProvider';
import { connectCRUDProvider } from '../../../services/CRUDProvider';
import { connectMapProvider } from '../../../views/Map/MapProvider';
import { withTableFilters } from '../../../services/UserSettingsProvider';
import { getView, getLayersPaints } from '../../../services/CRUD';
import compose from '../../../../../utils/compose';

import Edit from './Edit';

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
  getSettings,
  getFeaturesList,
  settings,
  map,
  feature,
  saveFeature,
  errors: {
    feature: featureError,
  },
}, {
  match: { params: { layer, id } },
}) => ({
  getSettings,
  getFeaturesList,
  map,
  feature: feature[id] || {},
  saveFeature,
  view: getView(settings, layer),
  layerPaint: getLayersPaints(settings).find(item => item['source-layer'] === layer) || {},
  paramLayer: layer,
  paramId: id,
  featureError: featureError.find(({ featureId }) => featureId === id),
});

export default compose(
  withRouter,
  connectAppProvider(appProviderGetter),
  connectAuthProvider(authProviderGetter),
  connectCRUDProvider(CRUDPRoviderGetter),
  connectMapProvider('addControl', 'removeControl'),
  withTableFilters(),
  withTranslation(),
)(Edit);
