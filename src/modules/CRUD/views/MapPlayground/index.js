import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';

import { connectAppProvider } from '../../../../components/AppProvider';
import { connectCRUDProvider } from '../../services/CRUDProvider';
import { withTableSize } from '../../services/UserSettingsProvider';
import { connectMapProvider } from '../../services/MapProvider';
import compose from '../../../../utils/compose';

import MapPlayground from './MapPlayground';

const appProviderGetter = ({
  env: {
    modules: { CRUD: { settings } },
  },
}) => ({
  settingsEndpoint: settings,
});


export default compose(
  withRouter,
  connectAppProvider(appProviderGetter),
  connectCRUDProvider('errors', 'getSettings', 'settings'),
  connectMapProvider('dataTableRef', 'detailsRef', 'featureToHighlight'),
  withTableSize(),
  withTranslation(),
)(MapPlayground);
