import DataTable from './DataTable';
import { connectRandoProvider } from '../../services/RandoProvider';

export default connectRandoProvider('map')(DataTable);
