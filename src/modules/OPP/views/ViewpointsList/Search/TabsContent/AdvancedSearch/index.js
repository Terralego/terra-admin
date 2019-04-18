import { withNamespaces } from 'react-i18next';

import { connectOppProvider } from '../../../../../services/OppProvider';
import { AdvancedSearch } from './AdvancedSearch';

export default connectOppProvider({
  codeError: 'errors.code',
  getFirstPageFilteredViewpointsAction: 'getFirstPageFilteredViewpointsAction',
})(withNamespaces()(AdvancedSearch));
