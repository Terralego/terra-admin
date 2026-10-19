import React from 'react';
import { useHistory } from 'react-router';
import { Admin, Resource } from 'react-admin';

// eslint-disable-next-line import/no-extraneous-dependencies
import polyglotI18nProvider from 'ra-i18n-polyglot';

import compose from '../../utils/compose';

import dataProvider from '../../services/react-admin/dataProvider';
import withResourceEndpoint from '../../services/react-admin/withResourceEndpoint';
import enhanceViewpointDataProvider from '../../services/react-admin/enhanceViewpointDataProvider';
import sourceDataProvider from '../../services/react-admin/sourceDataProvider';
import patchExtentDataProvider from '../../services/react-admin/patchExtentDataProvider';
import patchLayerDataProvider from '../../services/react-admin/patchLayerDataProvider';
import patchPictureDataProvider from '../../services/react-admin/patchPictureDataProvider';
import patchNullValueProvider from '../../services/react-admin/patchNullValueProvider';
import toMultipart from '../../services/react-admin/toMultipart';

import authProvider from '../../services/react-admin/authProvider';
import i18nProviderLegacy from '../../services/react-admin/i18nProvider';

import { withLocale } from '../../components/Locale';
import RALayout from '../../components/react-admin/Layout';
import RADashboard from './Dashboard';
import raTheme from '../../components/react-admin/theme';

import { resources, config } from './ra-modules';
import { withPermissions, withEnabledModules } from '../../hoc/withUserSettings';

const sanitizeProps = ({ enpoint, moduleName, requiredPermissions, ...rest }) =>
  rest;

const customDataProvider = compose(
  withResourceEndpoint,
  patchExtentDataProvider,
  patchPictureDataProvider,
  patchLayerDataProvider,
  patchNullValueProvider,
  toMultipart,
  sourceDataProvider,
  enhanceViewpointDataProvider,
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
        if (requiredPermissions && !permissions.includes(requiredPermissions)) {
          // Don't filter by permissions. Sometimes we want resource readonly
          // So we intentionnaly return true here
          return true;
        }

        return true;
      }),
    [enabledModules, permissions],
  );

  // <Admin> instanciates the layout and the dashboard itself, so the menu tree
  // and the enabled resources have to be bound here. Keep the identity stable,
  // or the whole layout remounts on every render.
  const layout = React.useMemo(
    () => layoutProps => (
      <RALayout {...layoutProps} menu={config.menu} resources={enabledResources} />
    ),
    [enabledResources],
  );

  const dashboard = React.useMemo(
    () => () => <RADashboard menu={config.menu} resources={enabledResources} />,
    [enabledResources],
  );

  if (!enabledResources.length) {
    return null;
  }

  return (
    <Admin
      layout={layout}
      dashboard={dashboard}
      theme={raTheme}
      history={history}
      dataProvider={customDataProvider}
      authProvider={authProvider}
      loginPage={false}
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
