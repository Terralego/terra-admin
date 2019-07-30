import { withNamespaces } from 'react-i18next';

import { connectCRUDProvider } from '../../services/CRUDProvider';
import Nav from './Nav';


export default withNamespaces()(connectCRUDProvider('getAllLayersAction', 'layersList', 'resizingMap')(Nav));
