import { connectAppProvider } from '../components/AppProvider';

const enabledModulesGetter = ({ env: { enabled_modules: enabledModules } }) => (
  enabledModules
    ? { enabledModules }
    : {}
);

// eslint-disable-next-line camelcase
export const withEnabledModules_DEPRECATED = connectAppProvider(enabledModulesGetter);

const mapConfigGetter = ({ env: { map, configMap = map } }) => ({ mapConfig: configMap });
export const withMapConfig = connectAppProvider(mapConfigGetter);

export default {
  withEnabledModules_DEPRECATED,
  withMapConfig,
};
