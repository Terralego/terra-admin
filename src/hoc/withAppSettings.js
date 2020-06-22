import { connectAppProvider } from '../components/AppProvider';

const enabledModulesGetter = ({ env: { enabled_modules: enabledModules } }) => ({ enabledModules });
export const withEnabledModules = connectAppProvider(enabledModulesGetter);


const mapConfigGetter = ({ env: { map, configMap = map } }) => ({ mapConfig: configMap });
export const withMapConfig = connectAppProvider(mapConfigGetter);

export default {
  withEnabledModules,
  withMapConfig,
};
