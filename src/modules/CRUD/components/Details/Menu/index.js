import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';

import Menu from './Menu';
import compose from '../../../../../utils/compose';

export default compose(
  withRouter,
  withTranslation(),
)(Menu);
