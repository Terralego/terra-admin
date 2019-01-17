import { withRouter } from 'react-router-dom';
import { connectOppProvider } from '../../services/OppProvider';
import Viewpoint from './Viewpoint';

export default withRouter(connectOppProvider(({
  getViewpoint,
}, {
  match: { params: { id } },
}) => ({
  viewpoint: getViewpoint(id),
}))(Viewpoint));
