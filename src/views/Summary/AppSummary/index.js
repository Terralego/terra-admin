import React from 'react';
import PropTypes from 'prop-types';

import { NavLink } from 'react-router-dom';
import { withTranslation } from 'react-i18next';

import { Tree } from '@blueprintjs/core';
import compose from '../../../utils/compose';
import { withPermissions, withEnabledModules } from '../../../hoc/withUserSettings';
import useBeta from '../../../hooks/useBeta';

const byPermissions = permissions => ({ requiredPermissions }) => {
  if (!requiredPermissions) {
    return true;
  }
  return permissions.includes(requiredPermissions);
};

const byModule = enabledModules => ({ requiredModule }) => {
  if (!requiredModule) {
    return true;
  }

  return enabledModules.includes(requiredModule);
};

const menuToTreeContents = (
  menu = [],
  t = text => text,
  permissions = [],
  enabledModules = [],
  showBeta = false,
) =>
  menu
    .filter(byPermissions(permissions))
    .filter(byModule(enabledModules))
    .filter(({ beta }) => !beta || showBeta)
    .map(({ items = [], label, href, ...rest }, index) => ({
      id: index,
      isExpanded: true,
      hasCaret: false,
      label: href
        ? (<NavLink to={href}>{t(label)}</NavLink>)
        : t(label),

      ...(items.length ? {
        childNodes: menuToTreeContents(items, t, permissions, enabledModules, showBeta),
        icon: 'folder-close',
      } : {}),

      ...rest,
    }));

export const AppSummary = ({ t, menu, permissions, enabledModules }) => {
  const beta = useBeta();
  return (
    <Tree contents={menuToTreeContents(menu, t, permissions, enabledModules, beta)} />
  );
};

AppSummary.defaultProps = {
  permissions: [],
  enabledModules: [],
  menu: [],
  t: text => text,
};

AppSummary.propTypes = {
  permissions: PropTypes.arrayOf(PropTypes.string),
  enabledModules: PropTypes.arrayOf(PropTypes.string),
  menu: PropTypes.arrayOf(PropTypes.shape({
    ...Tree.propTypes,
    href: PropTypes.string,
    label: PropTypes.string.isRequired,
    requiredPermissions: PropTypes.string,
  })),
  t: PropTypes.func,
};

export default compose(
  withTranslation(),
  withPermissions,
  withEnabledModules,
)(AppSummary);
