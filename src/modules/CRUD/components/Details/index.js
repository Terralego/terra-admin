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
    featuresList,
    errors,
  }, {
    match: { params: { layer, id } },
  }) => {
    const {
      error = {},
      error: { message = '' } = {},
    } = errors.feature.find(({ featureId }) => featureId === id) || {};
    return {
      map,
      fetchFeature,
      feature: featuresList.find(({ identifier }) => (
        identifier === id
      )) || {},
      layer: getLayer(settings, layer),
      hasError: !!error,
      errorMessage: message,
    };
  })(
    withNamespaces()(Details),
  ),
);
