import { connectAppProvider } from '../../components/AppProvider';
import { Summary } from './Summary';


export default connectAppProvider(({ env: { permissions } }) => ({
  permissions,
}))(Summary);
