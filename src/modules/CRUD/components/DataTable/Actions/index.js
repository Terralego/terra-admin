import { withNamespaces } from 'react-i18next';
import { withTableSize } from '../../../services/UserSettingsProvider';
import compose from '../../../../../utils/compose';

import Actions from './Actions';

export default compose(
  withNamespaces(),
  withTableSize(),
)(Actions);
