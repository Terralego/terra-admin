import { connectAuthProvider } from '@terralego/core/modules/Auth';
import { connectAppProvider } from '../../components/AppProvider';
import { withLocale } from '../../components/Locale';
import Main from './Main';

export default
withLocale(
  connectAppProvider('env', 'errorSettings')(
    connectAuthProvider('authenticated')(
      Main,
    ),
  ),
);
