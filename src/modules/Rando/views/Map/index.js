import { withRouter } from 'react-router-dom';
import { withNamespaces } from 'react-i18next';
import { connectRandoProvider } from '../../services/RandoProvider';

import Map from './Map';

export default connectRandoProvider(
  'getMapConfig',
  'mapConfig',
  'layersList',
  'setMap',
  'map',
  'resizingMap',
  'mapIsResizing',
  'getFeaturesList',
  'featuresList',
)(withRouter(withNamespaces()(Map)));
