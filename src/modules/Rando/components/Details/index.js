import { withRouter } from 'react-router';
import { withNamespaces } from 'react-i18next';
import { connectRandoProvider } from '../../services/RandoProvider';
import Details from './Details';

export default withRouter(connectRandoProvider(({
  layersList,
  map,
  fetchFeature,
  feature,
}, {
  match: { params: { layer, action, id } },
}) => ({
  map,
  fetchFeature,
  feature,
  layer: layersList.find(({ name }) => name === layer),
  paramLayer: layer,
  paramAction: action,
  paramId: id,
}))(withNamespaces()(Details)));
