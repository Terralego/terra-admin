import { withNamespaces } from 'react-i18next';
import { withRouter } from 'react-router';
import { connectAuthProvider } from '@terralego/core/modules/Auth';

import { connectRandoProvider } from '../../../services/RandoProvider';
import Actions from './Actions';

export default connectAuthProvider(({
  user,
}, { displayUpdate, displayDelete }) => {
  const { permissions = [] } = user;
  return {
    displayDelete: displayDelete && permissions.includes('terra.delete_feature'),
    displayUpdate: displayUpdate && permissions.includes('terra.change_feature'),
  };
})(
  withRouter(
    connectRandoProvider(({
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
