import { withRouter } from 'react-router';
import { withNamespaces } from 'react-i18next';
import { connectRandoProvider } from '../../../services/RandoProvider';
import Edit from './Edit';

export default withRouter(connectRandoProvider(({
  layersList,
  map,
  feature,
  saveFeature,
}, {
  match: { params: { layer, id } },
}) => ({
  map,
  feature,
  saveFeature,
  layer: layersList.find(({ name }) => name === layer),
  paramLayer: layer,
  paramId: id,
}))(withNamespaces()(Edit)));
