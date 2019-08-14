import { connectAuthProvider } from '@terralego/core/modules/Auth';
import { withNamespaces } from 'react-i18next';
import { connectAppProvider } from '../../components/AppProvider';
import { withLocale } from '../../components/Locale';
import Main from './Main';

export default
withNamespaces()(
  withLocale(
    connectAppProvider('env')(
      connectAuthProvider('authenticated')(
        Main,
      ),
    ),
  ),
);
