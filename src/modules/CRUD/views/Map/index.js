import { withRouter } from 'react-router-dom';
import { withNamespaces } from 'react-i18next';
import { connectAuthProvider } from '@terralego/core/modules/Auth';

import { connectCRUDProvider } from '../../services/CRUDProvider';

import Map from './Map';

export default withRouter(
  connectAuthProvider(({
    authenticated,
    user,
  }) => {
    const permissions = authenticated ? user.permissions : [];
    return {
      displayViewFeature: permissions.includes('terra.view_feature'),
    };
  })(
    connectCRUDProvider(
      'getSettings',
      'getMapConfig',
      'settings',
      'mapConfig',
      'setMap',
      'map',
      'mapIsResizing',
      'getFeaturesList',
      'featuresList',
      'feature',
      'errors',
    )(
      withNamespaces()(Map),
    ),
  ),
);
