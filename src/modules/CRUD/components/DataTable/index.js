import DataTable from './DataTable';
import { connectCRUDProvider } from '../../services/CRUDProvider';
import { withPageSize } from '../../services/UserSettingsProvider';
import compose from '../../../../utils/compose';

export default compose(
  connectCRUDProvider('getFeaturesList', 'featuresList', 'settings'),
  withPageSize(),
)(DataTable);
