import { withRouter } from 'react-router-dom';
import { withNamespaces } from 'react-i18next';

import { connectCRUDProvider } from '../../services/CRUDProvider';
import { getLayer } from '../../services/CRUD';

import Details from './Details';

export default withRouter(
  connectCRUDProvider(({
    settings,
    map,
    fetchFeature,
    feature,
    errors,
  }, {
    match: { params: { layer, id } },
  }) => {
    const errorFeature = errors.feature.find(({ featureId }) => (featureId === id));
    return {
      map,
      fetchFeature,
      feature,
      layer: getLayer(settings, layer),
      hasError: !!errorFeature,
      errorCode: errorFeature ? errorFeature.message : '',
    };
  })(
    withNamespaces()(Details),
  ),
);
