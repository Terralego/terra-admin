import { withRouter } from 'react-router-dom';
import { withNamespaces } from 'react-i18next';
import { connectAuthProvider } from '@terralego/core/modules/Auth';

import { connectCRUDProvider } from '../../../services/CRUDProvider';
import { getView, getLayersPaints } from '../../../services/CRUD';

import Edit from './Edit';

export default withRouter(
  connectAuthProvider(({
    authenticated,
    user,
  }) => {
    const permissions = authenticated ? user.permissions : [];
    return {
      displayAddFeature: permissions.includes('terra_geocrud.can_add_feature'),
      displayChangeFeature: permissions.includes('terra_geocrud.can_change_feature'),
    };
  })(
    connectCRUDProvider(({
      getSettings,
      getFeaturesList,
      settings,
      map,
      feature,
      saveFeature,
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
    }))(
      withNamespaces()(Edit),
    ),
  ),
);
