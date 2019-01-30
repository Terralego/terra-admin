import { connectOppProvider } from '../../services/OppProvider';
import FormCreateViewpoint from './ViewpointCreate';

export default connectOppProvider(state => ({
  getAllViewpointsAction: state.getAllViewpointsAction,
  viewpoints: state.viewpoints,
  saveViewpointAction: state.saveViewpointAction,
}))(FormCreateViewpoint);
