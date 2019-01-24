import { withRouter } from 'react-router-dom';
import { connectOppProvider } from '../../services/OppProvider';
import Viewpoint from './Viewpoint';

export default withRouter(connectOppProvider((state, { match: { params: { id } } }) => ({
  getAllViewpoints: state.getAllViewpoints,
  getViewpoint: state.getViewpoint,
  viewpoint: state.viewpoints[+id],
  hasError: state.errors[id],
  codeError: state.errors.code,
  saveViewpoint: state.saveViewpoint,
  uploadPictureViewpoint: state.uploadPictureViewpoint,
}))(Viewpoint));
