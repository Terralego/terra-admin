import { connectOppProvider } from '../../services/OppProvider';
import ViewpointList from './ViewpointList';

export default connectOppProvider('viewpointsList', 'fetchViewpoints')(ViewpointList);
