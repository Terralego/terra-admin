import { withNamespaces } from 'react-i18next';
import { withRouter } from 'react-router';

import { connectRandoProvider } from '../../../services/RandoProvider';
import Actions from './Actions';


export default withRouter(connectRandoProvider(({
  layersList,
  deleteFeature,
}, {
  match: { params: { layer } },
}) => ({
  deleteFeature,
  layer: layersList.find(({ name }) => name === layer),
}))(withNamespaces()(Actions)));
