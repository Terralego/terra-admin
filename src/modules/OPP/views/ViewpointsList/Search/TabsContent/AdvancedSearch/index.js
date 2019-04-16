import { connectOppProvider } from '../../../../../services/OppProvider';
import { AdvancedSearch } from './AdvancedSearch';

export default connectOppProvider({
  getFirstPageFilteredViewpointsAction: 'getFirstPageFilteredViewpointsAction',
})(AdvancedSearch);
