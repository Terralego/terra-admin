import { withNamespaces } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { connectAuthProvider } from '@terralego/core/modules/Auth';

import { connectCRUDProvider } from '../../../services/CRUDProvider';
import { getLayerFromCRUD } from '../../../services/CRUD';

import Actions from './Actions';

export default withRouter(
  connectAuthProvider(({
    authenticated,
    user,
  }, { displayUpdate, displayDelete }) => {
    const permissions = authenticated ? user.permissions : [];
    return {
      displayDelete: displayDelete && permissions.includes('terra.delete_feature'),
      displayUpdate: displayUpdate && permissions.includes('terra.change_feature'),
    };
  })(
    connectCRUDProvider(({
      settings,
      deleteFeature,
    }, {
      match: { params: { layer } },
    }) => ({
      deleteFeature,
      layer: getLayerFromCRUD(settings, layer),
    }))(
      withNamespaces()(Actions),
    ),
  ),
);
