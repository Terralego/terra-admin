import { withRouter } from 'react-router';
import { withNamespaces } from 'react-i18next';
import { connectRandoProvider } from '../../../services/RandoProvider';
import Edit from './Edit';

export default withRouter(connectRandoProvider(
  'map',
  'feature',
  'saveFeature',
)(withNamespaces()(Edit)));
