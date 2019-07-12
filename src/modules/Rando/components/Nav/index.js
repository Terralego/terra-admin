import { withNamespaces } from 'react-i18next';

import { connectRandoProvider } from '../../services/RandoProvider';
import Nav from './Nav';


export default withNamespaces()(connectRandoProvider('getAllLayersAction', 'layersList', 'resizingMap')(Nav));
