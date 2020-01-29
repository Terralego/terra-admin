import { withNamespaces } from 'react-i18next';

import DataTable from './DataTable';
import { connectCRUDProvider } from '../../services/CRUDProvider';
import {   withPageSize, withTableFilters } from '../../services/UserSettingsProvider';
import compose from '../../../../utils/compose';

export default compose(
  connectCRUDProvider('getFeaturesList', 'featuresList', 'settings'),
  withPageSize(),
  withTableFilters(),
  withNamespaces(),
)(DataTable);
