import { connectAuthProvider } from '@terralego/core/modules/Auth';
import { connectAppProvider } from '../../components/AppProvider';
import { withLocale } from '../../components/Locale';
import compose from '../../utils/compose';

import Main from './Main';

export default compose(
  withLocale,
  connectAppProvider('env', 'errorSettings'),
  connectAuthProvider('authenticated'),
)(Main);
