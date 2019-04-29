import { withRouter } from 'react-router';
import { connectRandoProvider } from '../../services/RandoProvider';
import Details from './Details';

export default withRouter(connectRandoProvider(({
  layersList,
  map,
  getFeature,
  feature,
}, {
  match: { params: { layer, action, id } },
}) => ({
  map,
  getFeature,
  feature,
  layer: layersList.find(({ name }) => name === layer),
  paramLayer: layer,
  paramAction: action,
  paramId: id,
}))(Details));
