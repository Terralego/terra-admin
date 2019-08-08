import { withRouter } from 'react-router-dom';
import { withNamespaces } from 'react-i18next';
import { connectAuthProvider } from '@terralego/core/modules/Auth';

import { connectCRUDProvider } from '../../../services/CRUDProvider';
import Edit from './Edit';

export default withRouter(
  connectAuthProvider(({
    authenticated,
    user,
  }) => {
    const permissions = authenticated ? user.permissions : [];
    return {
      displayAddFeature: permissions.includes('terra.add_feature'),
      displayChangeFeature: permissions.includes('terra.change_feature'),
    };
  })(
    connectCRUDProvider(({
      layersList,
      map,
      feature,
      saveFeature,
    }, {
      match: { params: { layer, id } },
    }) => ({
      map,
      feature,
      saveFeature,
      layer: layersList.find(({ name }) => name === layer),
      paramLayer: layer,
      paramId: id,
    }))(
      withNamespaces()(Edit),
    ),
  ),
);
