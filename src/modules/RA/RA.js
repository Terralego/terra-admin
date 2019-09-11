import React from 'react';
import { withRouter } from 'react-router-dom';
import { Admin, Resource } from 'react-admin';

import compose from '../../utils/compose';

import dataProvider from '../../services/react-admin/dataProvider';
import enhanceDataProvider from '../../services/react-admin/enhanceDataProvider';
import authProvider from '../../services/react-admin/authProvider';
import i18nProvider from '../../services/react-admin/i18nProvider';

import { withLocale } from '../../components/Locale';
import RALayout from '../../components/react-admin/Layout';

import { resources } from './ra-modules';
import { connectAppProvider } from '../../components/AppProvider';

const sanitizeProps = ({ enpoint, moduleName, ...rest }) => rest;

export const CustomAdmin = ({ locale, history, allowedModules = [] }) => {
  // Keep only allowedModules
  const enabledResources = resources.filter(({ moduleName }) =>
    allowedModules.includes(moduleName));

  return (
    <Admin
      appLayout={RALayout}
      locale={`${locale}`.substr(0, 2)}
      history={history}

      dataProvider={enhanceDataProvider(dataProvider)}
      authProvider={authProvider}
      i18nProvider={i18nProvider}
    >
      {enabledResources.map(resource => (
        <Resource key={resource.name} {...sanitizeProps(resource)} />
      ))}
    </Admin>
  );
};

const componentsToDisplay = ({ env: { enabled_modules: allowedModules } }) => ({ allowedModules });

export default compose(
  withRouter,
  withLocale,
  connectAppProvider(componentsToDisplay),
)(CustomAdmin);
