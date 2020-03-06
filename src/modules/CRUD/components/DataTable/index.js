import { withTranslation } from 'react-i18next';

import DataTable from './DataTable';
import { connectCRUDProvider } from '../../services/CRUDProvider';
import { withTableFilters } from '../../services/UserSettingsProvider';
import compose from '../../../../utils/compose';

export default compose(
  connectCRUDProvider('getFeaturesList', 'featuresList', 'settings'),
  withTableFilters(),
  withTranslation(),
)(DataTable);
