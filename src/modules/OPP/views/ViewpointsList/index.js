import { withNamespaces } from 'react-i18next';

import { connectOppProvider } from '../../services/OppProvider';
import ViewpointsList from './ViewpointsList';

export default connectOppProvider({
  viewpointsList: 'viewpointsList.current',
  getPaginatedViewpointsAction: 'getPaginatedViewpointsAction',
})(withNamespaces()(ViewpointsList));
