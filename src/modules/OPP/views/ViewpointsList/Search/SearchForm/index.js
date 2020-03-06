import { withTranslation } from 'react-i18next';

import { connectOppProvider } from '../../../../services/OppProvider';
import { SearchForm } from './SearchForm';

export default connectOppProvider({
  getFirstPageFilteredViewpointsAction: 'getFirstPageFilteredViewpointsAction',
})(withTranslation()(SearchForm));
