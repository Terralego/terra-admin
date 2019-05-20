import { connectAuthProvider } from '@terralego/core/modules/Auth';
import { withNamespaces } from 'react-i18next';
import { connectAppProvider } from '../../../components/AppProvider';

import Header from './Header';

export default connectAppProvider(({ env: { title = '', theme: { logo = '' } = {} } }) => ({
  title,
  logo,
}))(connectAuthProvider('authenticated')(withNamespaces()(Header)));
