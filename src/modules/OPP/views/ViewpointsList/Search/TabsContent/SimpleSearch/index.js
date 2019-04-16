import { connectOppProvider } from '../../../../../services/OppProvider';
import { SimpleSearch } from './SimpleSearch';

export default connectOppProvider({
  getFirstPageFilteredViewpointsAction: 'getFirstPageFilteredViewpointsAction',
})(SimpleSearch);
