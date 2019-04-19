import { withRouter } from 'react-router-dom';
import { connectRandoProvider } from '../../services/RandoProvider';

import Map from './Map';

export default connectRandoProvider('getMapConfig', 'mapConfig', 'layersList', 'setMap', 'map', 'resizingMap', 'mapIsResizing')(withRouter(Map));
