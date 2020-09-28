import React from 'react';
import { useHistory } from 'react-router';
import { Admin, Resource } from 'react-admin';

// eslint-disable-next-line import/no-extraneous-dependencies
import polyglotI18nProvider from 'ra-i18n-polyglot';

import compose from '../../utils/compose';

import dataProvider from '../../services/react-admin/dataProvider';
import withResourceEndpoint from '../../services/react-admin/withResourceEndpoint';
import enhanceDataProvider from '../../services/react-admin/enhanceDataProvider';
import patchPictureDataProvider from '../../services/react-admin/patchPictureDataProvider';
import toMultipart from '../../services/react-admin/toMultipart';

import authProvider from '../../services/react-admin/authProvider';
import i18nProviderLegacy from '../../services/react-admin/i18nProvider';

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

export const CustomAdmin = ({ locale, permissions, allowedModules = [] }) => {
  const history = useHistory();

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
    patchPictureDataProvider,
    toMultipart,
    enhanceDataProvider,
  )(dataProvider);

  const i18nProvider = polyglotI18nProvider(i18nProviderLegacy, `${locale}`.substr(0, 2));

  return (
    <Admin
      layout={RALayout}
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
  withLocale,
  withPermissions,
  connectAppProvider(componentsToDisplay),
)(CustomAdmin);
