import { withNamespaces } from 'react-i18next';

import { connectOppProvider } from '../../../../../services/OppProvider';
import { SimpleSearch } from './SimpleSearch';

export default connectOppProvider({
  getFirstPageFilteredViewpointsAction: 'getFirstPageFilteredViewpointsAction',
})(withNamespaces()(SimpleSearch));
