import { withRouter } from 'react-router-dom';
import { connectOppProvider } from '../../services/OppProvider';
import Viewpoint from './Viewpoint';

export default withRouter(connectOppProvider((state, {match: {params: {id}}}) => ({
  fetchViewpoint: state.fetchViewpoint,
  viewpoint: state.viewpoints[+id],
  hasError: state.errors[id],
  fetchViewpointPut : state.fetchViewpointPut,
}))(Viewpoint));
