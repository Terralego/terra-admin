import { connectOppProvider } from '../../services/OppProvider';
import FormCreateViewpoint from './ViewpointCreate';

export default connectOppProvider('getAllViewpointsAction', 'viewpoints', 'saveViewpointAction')(FormCreateViewpoint);
