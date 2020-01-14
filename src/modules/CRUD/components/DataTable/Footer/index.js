import { withNamespaces } from 'react-i18next';
import { connectUserSettingsProvider } from '../../../services/UserSettingsProvider';
import compose from '../../../../../utils/compose';
import Footer from './Footer';

export default compose(
  connectUserSettingsProvider('pageSize', 'setPageSize'),
  withNamespaces(),
)(Footer);
