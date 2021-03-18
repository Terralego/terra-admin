import { withLocale } from '../../components/Locale';
import compose from '../../utils/compose';

import Main from './Main';

export default compose(
  withLocale,
)(Main);
