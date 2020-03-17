import { withTranslation } from 'react-i18next';
import { connectCRUDProvider } from '../../../../services/CRUDProvider';
import { connectMapProvider } from '../../../../views/Map/MapProvider';
import { getLayersPaints } from '../../../../services/CRUD';

import GeomView from './GeomView';
import compose from '../../../../../../utils/compose';

const CRUDPRoviderGetter = ({
  map,
  settings,
}) => ({
  layerPaints: getLayersPaints(settings),
  map,
});

export default compose(
  withTranslation(),
  connectCRUDProvider(CRUDPRoviderGetter),
  connectMapProvider('addControl', 'removeControl'),
)(GeomView);
