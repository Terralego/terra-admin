import { withNamespaces } from 'react-i18next';
import { withPageSize } from '../../../services/UserSettingsProvider';
import compose from '../../../../../utils/compose';
import Footer from './Footer';

export default compose(
  withPageSize(),
  withNamespaces(),
)(Footer);
