import { withTranslation } from 'react-i18next';
import { withTableSize } from '../../../services/UserSettingsProvider';
import compose from '../../../../../utils/compose';

import Actions from './Actions';

export default compose(
  withTranslation(),
  withTableSize(),
)(Actions);
