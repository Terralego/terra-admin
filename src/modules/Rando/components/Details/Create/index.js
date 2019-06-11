import { withRouter } from 'react-router';
import { withNamespaces } from 'react-i18next';
import { connectRandoProvider } from '../../../services/RandoProvider';
import Create from './Create';

export default withRouter(connectRandoProvider(
  'map',
  'saveFeature',
)(withNamespaces()(Create)));
