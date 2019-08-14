import DataTable from './DataTable';
import { connectCRUDProvider } from '../../services/CRUDProvider';

export default connectCRUDProvider(({ layersList, featuresList }, { source }) => ({
  featuresList,
  layer: layersList.find(({ name }) => name === source),
  source,
}))(DataTable);
