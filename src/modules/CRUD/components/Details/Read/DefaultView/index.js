import { withRouter } from 'react-router-dom';
import { withNamespaces } from 'react-i18next';

import DefaultView from './DefaultView';
import compose from '../../../../../../utils/compose';

export default compose(
  withRouter,
  withNamespaces(),
)(DefaultView);
