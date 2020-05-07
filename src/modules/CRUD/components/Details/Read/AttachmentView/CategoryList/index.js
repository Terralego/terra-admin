import React from 'react';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { connectCRUDProvider } from '../../../../../services/CRUDProvider';
import compose from '../../../../../../../utils/compose';

import CategoryList from './CategoryList';

const CRUDPRoviderGetter = ({
  feature,
}, {
  name,
  match: { params: { id } },
}) => ({
  categories: feature[id][name],
});

const sanitizeProps = WrappedComponent => ({
  history,
  i18n,
  location,
  match,
  staticContext,
  tReady,
  ...props
}) => <WrappedComponent {...props} />;

export default compose(
  withRouter,
  withTranslation(),
  connectCRUDProvider(CRUDPRoviderGetter),
  sanitizeProps,
)(CategoryList);
