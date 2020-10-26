import { withTranslation } from 'react-i18next';
import { connectAuthProvider } from '@terralego/core/modules/Auth';
import { connectCRUDProvider } from '../../../services/CRUDProvider';
import compose from '../../../../../utils/compose';

import NavItem from './NavItem';

const authProviderGetter = ({
  authenticated,
  user,
}) => {
  const permissions = authenticated ? user.permissions : [];
  return {
    displayAddFeature: permissions.includes('can_add_feature'),
  };
};

export default compose(
  connectAuthProvider(authProviderGetter),
  connectCRUDProvider('dataTableRef'),
  withTranslation(),
)(NavItem);
