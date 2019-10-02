import { withNamespaces } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { connectAuthProvider } from '@terralego/core/modules/Auth';

import { connectCRUDProvider } from '../../../services/CRUDProvider';
import { getLayer } from '../../../services/CRUD';

import Actions from './Actions';

export default withRouter(
  connectAuthProvider(({
    authenticated,
    user,
  }, { displayUpdate, displayDelete }) => {
    const permissions = authenticated ? user.permissions : [];
    return {
      displayDelete: displayDelete && permissions.includes('geostore.delete_feature'),
      displayUpdate: displayUpdate && permissions.includes('geostore.change_feature'),
    };
  })(
    connectCRUDProvider(({
      getSettings,
      settings,
      deleteFeature,
    }, {
      match: { params: { layer } },
    }) => ({
      getSettings,
      deleteFeature,
      layer: getLayer(settings, layer),
    }))(
      withNamespaces()(Actions),
    ),
  ),
);
