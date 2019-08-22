import { withNamespaces } from 'react-i18next';

import { connectCRUDProvider } from '../../services/CRUDProvider';
import Nav from './Nav';


export default connectCRUDProvider('settings', 'resizingMap')(
  withNamespaces()(Nav),
);
