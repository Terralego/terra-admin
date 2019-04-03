import { connectAppProvider } from '../../../components/AppProvider';
import { Content } from './Content';


export default connectAppProvider(({ env: { permissions } }) => ({
  permissions,
}))(Content);
