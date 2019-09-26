import { withRouter } from 'react-router-dom';
import { withNamespaces } from 'react-i18next';
import { connectAuthProvider } from '@terralego/core/modules/Auth';

import { connectCRUDProvider } from '../../../services/CRUDProvider';
import { getLayersPaints } from '../../../services/CRUD';

import Edit from './Edit';

export default withRouter(
  connectAuthProvider(({
    authenticated,
    user,
  }) => {
    const permissions = authenticated ? user.permissions : [];
    return {
      displayAddFeature: permissions.includes('geostore.add_feature'),
      displayChangeFeature: permissions.includes('geostore.change_feature'),
    };
  })(
    connectCRUDProvider(({
      settings,
      map,
      featuresList,
      saveFeature,
    }, {
      match: { params: { layer, id } },
    }) => ({
      map,
      feature: featuresList.find(({ identifier }) => (
        identifier === id
      )) || {},
      saveFeature,
      layerPaint: getLayersPaints(settings).find(item => item['source-layer'] === layer) || {},
      paramLayer: layer,
      paramId: id,
    }))(
      withNamespaces()(Edit),
    ),
  ),
);
