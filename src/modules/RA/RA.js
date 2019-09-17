import React from 'react';
import { withRouter } from 'react-router-dom';
import { Admin, Resource } from 'react-admin';

import compose from '../../utils/compose';

import dataProvider from '../../services/react-admin/dataProvider';
import withResourceEndpoint from '../../services/react-admin/withResourceEndpoint';
import withViewpointIds from '../../services/react-admin/withViewpointIds';
import enhanceDataProvider from '../../services/react-admin/enhanceDataProvider';

import authProvider from '../../services/react-admin/authProvider';
import i18nProvider from '../../services/react-admin/i18nProvider';

import { withLocale } from '../../components/Locale';
import RALayout from '../../components/react-admin/Layout';

import { resources } from './ra-modules';
import { connectAppProvider } from '../../components/AppProvider';
import { withPermissions } from '../../hoc/withUserSettings';

const sanitizeProps = ({
  enpoint,
  moduleName,
  requiredPermissions,
  ...rest
}) => rest;

export const CustomAdmin = ({ locale, history, permissions, allowedModules = [] }) => {
  // Keep only allowedModules
  const enabledResources = resources.filter(({ moduleName, requiredPermissions }) => {
    if (!allowedModules.includes(moduleName)) {
      return false;
    }
    if (requiredPermissions && !permissions.includes[requiredPermissions]) {
      return false;
    }

    return true;
  });

  if (!enabledResources.length) {
    return null;
  }

  const customDataProvider = compose(
    withResourceEndpoint,
    withViewpointIds,
    enhanceDataProvider,
  )(dataProvider);

  return (
    <Admin
      appLayout={RALayout}
      locale={`${locale}`.substr(0, 2)}
      history={history}
      dataProvider={customDataProvider}
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
  withPermissions,
  connectAppProvider(componentsToDisplay),
)(CustomAdmin);
