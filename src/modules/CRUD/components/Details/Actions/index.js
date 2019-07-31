import { withNamespaces } from 'react-i18next';
import { withRouter } from 'react-router';
import { connectAuthProvider } from '@terralego/core/modules/Auth';

import { connectCRUDProvider } from '../../../services/CRUDProvider';
import Actions from './Actions';

export default connectAuthProvider(({
  authenticated,
  user,
}, { displayUpdate, displayDelete }) => {
  const permissions = authenticated ? user.permissions : [];
  return {
    displayDelete: displayDelete && permissions.includes('terra.delete_feature'),
    displayUpdate: displayUpdate && permissions.includes('terra.change_feature'),
  };
})(
  withRouter(
    connectCRUDProvider(({
      layersList,
      deleteFeature,
    }, {
      match: { params: { layer } },
    }) => ({
      deleteFeature,
      layer: layersList.find(({ name }) => name === layer),
    }))(withNamespaces()(Actions)),
  ),
);
