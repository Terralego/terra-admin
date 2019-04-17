import { withNamespaces } from 'react-i18next';

import { connectOppProvider } from '../../../../../services/OppProvider';
import { SimpleSearch } from './SimpleSearch';

export default connectOppProvider({
  codeError: 'errors.code',
  getFirstPageFilteredViewpointsAction: 'getFirstPageFilteredViewpointsAction',
})(withNamespaces()(SimpleSearch));
