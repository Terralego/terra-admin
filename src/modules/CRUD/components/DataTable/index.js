import DataTable from './DataTable';
import { connectCRUDProvider } from '../../services/CRUDProvider';
import { connectUserSettingsProvider } from '../../services/UserSettingsProvider';
import compose from '../../../../utils/compose';

export default compose(
  connectCRUDProvider('getFeaturesList', 'featuresList', 'settings'),
  connectUserSettingsProvider('pageSize'),
)(DataTable);
