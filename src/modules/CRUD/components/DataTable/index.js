import DataTable from './DataTable';
import { connectCRUDProvider } from '../../services/CRUDProvider';

const withCRUDProviderData = connectCRUDProvider(({
  getFeaturesList,
  featuresList,
  settings,
}, {
  layerName,
}) => ({
  getFeaturesList,
  featuresList,
  settings,
  layerName,
}));

export default withCRUDProviderData(DataTable);
