import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { connectCRUDProvider } from '../../../../../services/CRUDProvider';
import compose from '../../../../../../../utils/compose';

import CategoryList from './CategoryList';

const CRUDPRoviderGetter = ({
  feature,
}, {
  name,
  match: { params: { id } },
}) => ({
  categories: feature[id][name],
});

export default compose(
  withRouter,
  withTranslation(),
  connectCRUDProvider(CRUDPRoviderGetter),
)(CategoryList);
