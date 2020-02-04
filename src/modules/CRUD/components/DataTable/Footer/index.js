import { withNamespaces } from 'react-i18next';
import { withTableFilters } from '../../../services/UserSettingsProvider';
import compose from '../../../../../utils/compose';
import Footer from './Footer';

export default compose(
  withNamespaces(),
  withTableFilters(),
)(Footer);
