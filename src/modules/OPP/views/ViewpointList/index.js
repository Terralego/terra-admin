import { connectAppProvider } from '../../../../components/AppProvider';
import data from './mock.json';
import ViewpointList from './ViewpointList';

export default connectAppProvider(() => ({
  viewpoints: data.results,
}))(ViewpointList);
