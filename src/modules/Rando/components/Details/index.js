import { withRouter } from 'react-router';
import { connectRandoProvider } from '../../services/RandoProvider';
import Details from './Details';

export default withRouter(connectRandoProvider(({
  layersList,
  map,
  getFeature,
  feature,
}, {
  history: { push },
  match: { params: { layer, action, id } },
  visible,
}) => ({
  map,
  getFeature,
  feature,
  layer: layersList.find(({ name }) => name === layer),
  historyPush: push,
  paramLayer: layer,
  paramAction: action,
  paramId: id,
  visible,
}))(Details));
