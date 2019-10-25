import { withRouter } from 'react-router-dom';
import { withNamespaces } from 'react-i18next';

import Menu from './Menu';
import compose from '../../../../../utils/compose';

export default compose(
  withRouter,
  withNamespaces(),
)(Menu);
