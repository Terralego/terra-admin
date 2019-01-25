import { withRouter } from 'react-router-dom';
import { connectOppProvider } from '../../services/OppProvider';
import Viewpoint from './Viewpoint';

export default withRouter(connectOppProvider((state, { match: { params: { id } } }) => ({
  getAllViewpointsAction: state.getAllViewpointsAction,
  getViewpointAction: state.getViewpointAction,
  viewpoint: state.viewpoints[+id],
  hasError: state.errors[id],
  codeError: state.errors.code,
  saveViewpointAction: state.saveViewpointAction,
  uploadPictureViewpointAction: state.uploadPictureViewpointAction,
}))(Viewpoint));
