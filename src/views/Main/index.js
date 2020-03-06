import { connectAuthProvider } from '@terralego/core/modules/Auth';
import { withTranslation } from 'react-i18next';
import { connectAppProvider } from '../../components/AppProvider';
import { withLocale } from '../../components/Locale';
import Main from './Main';

export default
withTranslation()(
  withLocale(
    connectAppProvider('env', 'errorSettings')(
      connectAuthProvider('authenticated')(
        Main,
      ),
    ),
  ),
);
