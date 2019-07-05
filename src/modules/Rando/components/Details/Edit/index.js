import { withRouter } from 'react-router';
import { withNamespaces } from 'react-i18next';
import { connectAuthProvider } from '@terralego/core/modules/Auth';

import { connectRandoProvider } from '../../../services/RandoProvider';
import Edit from './Edit';

export default connectAuthProvider(({
  user,
}) => {
  const { permissions = [] } = user;
  return {
    displayAddFeature: permissions.includes('terra.add_feature'),
    displayChangeFeature: permissions.includes('terra.change_feature'),
  };
})(
  withRouter(
    connectRandoProvider(({
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
    }))(withNamespaces()(Edit)),
  ),
);
