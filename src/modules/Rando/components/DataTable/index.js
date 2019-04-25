import DataTable from './DataTable';
import { connectRandoProvider } from '../../services/RandoProvider';

export default connectRandoProvider(({ layersList, featuresList }, { source }) => ({
  featuresList,
  layer: layersList.find(({ name }) => name === source),
  source,
}))(DataTable);
