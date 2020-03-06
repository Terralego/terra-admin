import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';

import Metas from './Metas';
import compose from '../../../../../utils/compose';

export default compose(
  withRouter,
  withTranslation(),
)(Metas);
