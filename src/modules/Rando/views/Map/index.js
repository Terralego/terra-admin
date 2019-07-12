import { withRouter } from 'react-router-dom';
import { withNamespaces } from 'react-i18next';
import { connectAuthProvider } from '@terralego/core/modules/Auth';

import { connectRandoProvider } from '../../services/RandoProvider';

import Map from './Map';

export default connectAuthProvider(({
  authenticated,
  user,
}) => {
  const permissions = authenticated ? user.permissions : [];
  return {
    displayViewFeature: permissions.includes('terra.view_feature'),
  };
})(
  connectRandoProvider(
    'getMapConfig',
    'mapConfig',
    'layersList',
    'setMap',
    'map',
    'resizingMap',
    'mapIsResizing',
    'getFeaturesList',
    'featuresList',
    'feature',
  )(
    withRouter(
      withNamespaces()(Map),
    ),
  ),
);
