import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { connectCRUDProvider } from '../../../services/CRUDProvider';

import compose from '../../../../../utils/compose';

import FitBoundButton from './FitBoundButton';

const CRUDPRoviderGetter = ({
  detailsRef,
  feature,
  map,
}, {
  match: {
    params: {
      id,
    },
  },
}) => {
  const { geom: { coordinates } = {} } = feature[id] || {};
  return {
    coordinates,
    detailsRef,
    map,
  };
};


export default compose(
  withRouter,
  withTranslation(),
  connectCRUDProvider(CRUDPRoviderGetter),
)(FitBoundButton);
