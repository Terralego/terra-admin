import { connectOppProvider } from '../../services/OppProvider';
import ViewpointsList from './ViewpointsList';

export default connectOppProvider('viewpointsList', 'getAllViewpointsAction')(ViewpointsList);
