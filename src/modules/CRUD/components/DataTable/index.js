import DataTable from './DataTable';
import { connectCRUDProvider } from '../../services/CRUDProvider';
import { getLayerFromCRUD } from '../../services/CRUD';

export default connectCRUDProvider(({ featuresList, settings }, { layerName }) => ({
  featuresList,
  layer: getLayerFromCRUD(settings, layerName),
  layerName,
}))(DataTable);
