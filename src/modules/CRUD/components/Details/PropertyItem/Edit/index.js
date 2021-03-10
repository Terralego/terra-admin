import { connectAppProvider } from '../../../../../../components/AppProvider';

import Edit from './Edit';

import compose from '../../../../../../utils/compose';

const appProviderGetter = ({
  env: { modules: { CRUD: { settings } } },
}) => ({
  settingsEndpoint: settings,
});

export default compose(
  connectAppProvider(appProviderGetter),
)(Edit);
