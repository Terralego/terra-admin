import { withNamespaces } from 'react-i18next';
import compose from '../../../../../utils/compose';

import PropertyItem from './PropertyItem';

export default compose(
  withNamespaces(),
)(PropertyItem);
