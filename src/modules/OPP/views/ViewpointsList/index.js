import { withNamespaces } from 'react-i18next';

import { connectOppProvider } from '../../services/OppProvider';
import ViewpointsList from './ViewpointsList';

export default connectOppProvider({
  viewpointsList: 'viewpointsList.current',
  isLoading: 'loading',
  errorCode: 'errors.code',
  getPaginatedViewpointsAction: 'getPaginatedViewpointsAction',
  getFirstPageFilteredViewpointsAction: 'getFirstPageFilteredViewpointsAction',
})(withNamespaces()(ViewpointsList));
