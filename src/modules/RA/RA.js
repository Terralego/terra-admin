import React from 'react';
import { useHistory } from 'react-router';
import { Admin, Resource } from 'react-admin';

// eslint-disable-next-line import/no-extraneous-dependencies
import polyglotI18nProvider from 'ra-i18n-polyglot';

import compose from '../../utils/compose';

import dataProvider from '../../services/react-admin/dataProvider';
import withResourceEndpoint from '../../services/react-admin/withResourceEndpoint';
import enhanceDataProvider from '../../services/react-admin/enhanceDataProvider';
import sourceDataProvider from '../../services/react-admin/sourceDataProvider';
import patchLayerDataProvider from '../../services/react-admin/patchLayerDataProvider';
import patchPictureDataProvider from '../../services/react-admin/patchPictureDataProvider';
import toMultipart from '../../services/react-admin/toMultipart';

import authProvider from '../../services/react-admin/authProvider';
import i18nProviderLegacy from '../../services/react-admin/i18nProvider';

import { withLocale } from '../../components/Locale';
import RALayout from '../../components/react-admin/Layout';

import { resources } from './ra-modules';
import { withPermissions, withEnabledModules } from '../../hoc/withUserSettings';

const sanitizeProps = ({ enpoint, moduleName, requiredPermissions, ...rest }) =>
  rest;

const customDataProvider = compose(
  withResourceEndpoint,
  patchPictureDataProvider,
  patchLayerDataProvider,
  toMultipart,
  sourceDataProvider,
  enhanceDataProvider,
)(dataProvider);

export const CustomAdmin = ({ locale, permissions, enabledModules = [] }) => {
  const history = useHistory();

  const i18nProvider = React.useMemo(
    () => polyglotI18nProvider(i18nProviderLegacy, `${locale}`.substr(0, 2)),
    [locale],
  );

  // Keep only allowedModules
  const enabledResources = React.useMemo(
    () =>
      resources.filter(({ moduleName, requiredPermissions }) => {
        if (!enabledModules.includes(moduleName)) {
          return false;
        }
        if (requiredPermissions && !permissions.includes[requiredPermissions]) {
          return false;
        }

        return true;
      }),
    [enabledModules, permissions],
  );

  if (!enabledResources.length) {
    return null;
  }

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

export default compose(
  withLocale,
  withPermissions,
  withEnabledModules,
)(CustomAdmin);
