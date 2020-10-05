import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';

import { connectCRUDProvider } from '../../services/CRUDProvider';
import { getView } from '../../services/CRUD';

import Details from './Details';

export default withRouter(
  connectCRUDProvider(({
    settings,
    fetchFeature,
    feature,
    errors,
  }, {
    match: { params: { layer, id } },
  }) => {
    const {
      error = {},
      error: { message = '' } = {},
    } = errors.feature.find(({ featureId }) => featureId === id) || {};
    return {
      fetchFeature,
      feature: feature[id] || {},
      view: getView(settings, layer),
      hasError: !!error,
      errorMessage: message,
    };
  })(
    withTranslation()(Details),
  ),
);
