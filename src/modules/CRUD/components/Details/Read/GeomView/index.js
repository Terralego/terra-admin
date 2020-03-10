import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { connectCRUDProvider } from '../../../../services/CRUDProvider';
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
  withRouter,
  withTranslation(),
  connectCRUDProvider(CRUDPRoviderGetter),
)(GeomView);
