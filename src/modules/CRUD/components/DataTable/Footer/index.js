import { withNamespaces } from 'react-i18next';
import { withPageSize, withTableFilters } from '../../../services/UserSettingsProvider';
import compose from '../../../../../utils/compose';
import Footer from './Footer';

export default compose(
  withNamespaces(),
  withPageSize(),
  withTableFilters(),
)(Footer);
