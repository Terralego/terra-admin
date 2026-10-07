import { withTranslation } from 'react-i18next';
import { connectAuthProvider } from '../../../terra-front/Auth';
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
