import { withRouter } from 'react-router-dom';
import { withNamespaces } from 'react-i18next';
import { connectAuthProvider } from '@terralego/core/modules/Auth';

import { connectCRUDProvider } from '../../services/CRUDProvider';
import compose from '../../../../utils/compose';

import Map from './Map';

const authProvider = ({
  authenticated,
  user,
}) => {
  const permissions = authenticated ? user.permissions : [];
  return {
    displayViewFeature: permissions.includes('terra_geocrud.can_view_feature'),
  };
};

const CRUDPRovider = ({
  getSettings,
  settings,
  setMap,
  map,
  mapIsResizing,
  feature,
  errors,
}, {
  match: {
    params: {
      id,
    },
  },
}) => ({
  getSettings,
  settings,
  setMap,
  map,
  mapIsResizing,
  feature: feature[id] || {},
  errors,
});

export default compose(
  withRouter,
  connectAuthProvider(authProvider),
  connectCRUDProvider(CRUDPRovider),
  withNamespaces(),
)(Map);
