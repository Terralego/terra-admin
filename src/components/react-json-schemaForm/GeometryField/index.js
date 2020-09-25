import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import compose from '../../../utils/compose';
import { connectCRUDProvider } from '../../../modules/CRUD/services/CRUDProvider';
import { connectMapProvider } from '../../../modules/CRUD/views/Map/MapProvider';
import { getLayersPaints } from '../../../modules/CRUD/services/CRUD';

import GeometryField from './GeometryField';

const CRUDPRoviderGetter = ({ detailsRef, feature, map, settings }) =>
  ({ detailsRef, feature, map, settings, layerPaints: getLayersPaints(settings) });

export default compose(
  withRouter,
  withTranslation(),
  connectCRUDProvider(CRUDPRoviderGetter),
  connectMapProvider('addControl', 'removeControl'),
)(GeometryField);
