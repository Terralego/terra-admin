import { withNamespaces } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { connectAuthProvider } from '@terralego/core/modules/Auth';

import { connectCRUDProvider } from '../../../services/CRUDProvider';
import { getView } from '../../../services/CRUD';
import compose from '../../../../../utils/compose';

import Actions from './Actions';

const authProvider = ({
  authenticated,
  user,
}, { displayUpdate, displayDelete }) => {
  const permissions = authenticated ? user.permissions : [];
  return {
    displayDelete: displayDelete && permissions.includes('terra_geocrud.can_delete_feature'),
    displayUpdate: displayUpdate && permissions.includes('terra_geocrud.can_change_feature'),
  };
};

const CRUDPRovider = ({
  getSettings,
  settings,
  deleteFeature,
}, {
  match: { params: { layer } },
}) => ({
  getSettings,
  deleteFeature,
  view: getView(settings, layer),
});

export default compose(
  withRouter,
  connectAuthProvider(authProvider),
  connectCRUDProvider(CRUDPRovider),
  withNamespaces(),
)(Actions);
