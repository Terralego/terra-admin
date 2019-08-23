import DataTable from './DataTable';
import { connectCRUDProvider } from '../../services/CRUDProvider';
import { getLayer } from '../../services/CRUD';

export default connectCRUDProvider(({ featuresList, settings }, { layerName }) => ({
  featuresList,
  layer: getLayer(settings, layerName),
  layerName,
}))(DataTable);
