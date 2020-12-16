import { connectAppProvider } from '../components/AppProvider';


const mapConfigGetter = ({ env: { map, configMap = map } }) => ({ mapConfig: configMap });
export const withMapConfig = connectAppProvider(mapConfigGetter);

export default {
  withMapConfig,
};
