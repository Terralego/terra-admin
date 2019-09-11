import React from 'react';
import { withRouter } from 'react-router-dom';
import { Admin, Resource } from 'react-admin';

import { withLocale } from '../../components/Locale';
import providers from '../../services/react-admin/providers';
import RALayout from '../../components/react-admin/Layout';

import { resources } from './ra-modules';

export const CustomAdmin = ({ locale, history }) => (
  <Admin
    appLayout={RALayout}
    locale={`${locale}`.substr(0, 2)}
    history={history}
    {...providers}
  >
    {resources.map(resource => <Resource key={resource.name} {...resource} />)}
  </Admin>
);

export default withRouter(withLocale(CustomAdmin));
