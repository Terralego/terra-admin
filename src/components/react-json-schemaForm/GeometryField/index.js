import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import compose from '../../../utils/compose';
import { connectCRUDProvider } from '../../../modules/CRUD/services/CRUDProvider';
import { connectMapProvider } from '../../../modules/CRUD/services/MapProvider';

import GeometryField from './GeometryField';

export default compose(
  withRouter,
  withTranslation(),
  connectCRUDProvider('feature', 'settings'),
  connectMapProvider('addControl', 'map', 'removeControl', 'setFitBounds'),
)(GeometryField);
