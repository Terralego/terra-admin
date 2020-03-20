import { connectAuthProvider } from '@terralego/core/modules/Auth';
import { withTranslation } from 'react-i18next';
import { connectAppProvider } from '../../../components/AppProvider';

import Header from './Header';

export default connectAppProvider(({
  env: {
    title,
    theme: { logo, heading } = {},
  },
}) => ({
  title,
  logo,
  heading,
}))(connectAuthProvider('authenticated')(withTranslation()(Header)));
