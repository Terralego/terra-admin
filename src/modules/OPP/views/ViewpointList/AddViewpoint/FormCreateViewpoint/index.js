import { connectOppProvider } from '../../../../services/OppProvider';
import FormCreateViewpoint from './FormCreateViewpoint';

export default connectOppProvider(state => ({
  getAllViewpointsAction: state.getAllViewpointsAction,
  viewpointsList: state.viewpointsList,
  saveViewpointAction: state.saveViewpointAction,
}))(FormCreateViewpoint);
