import { withRouter } from 'react-router';
import { withNamespaces } from 'react-i18next';
import { connectRandoProvider } from '../../../services/RandoProvider';
import Update from './Update';

export default withRouter(connectRandoProvider(
  'map',
  'feature',
  'saveFeature',
  'featuresList',
)(withNamespaces()(Update)));
