import { connectAppProvider } from '../components/AppProvider';

const enabledModulesGetter = ({ env: { enabled_modules: enabledModules } }) => ({ enabledModules });
export const withEnabledModules = connectAppProvider(enabledModulesGetter);

export default {
  withEnabledModules,
};
