import React from 'react';
import PropTypes from 'prop-types';

import { NavLink } from 'react-router-dom';
import { withNamespaces } from 'react-i18next';

import { Tree } from '@blueprintjs/core';
import compose from '../../../utils/compose';
import { withPermissions } from '../../../hoc/withUserSettings';

const byPermissions = permissions => ({ requiredPermissions }) => {
  if (!requiredPermissions) {
    return true;
  }

  return permissions.includes(requiredPermissions);
};

const menuToTreeContents = (menu = [], t = text => text, permissions = []) =>
  menu
    .filter(byPermissions(permissions))
    .map(({ items = [], label, href, ...rest }, index) => ({
      id: index,
      isExpanded: true,
      hasCaret: false,
      label: href
        ? (<NavLink to={href}>{t(label)}</NavLink>)
        : t(label),

      ...(items.length ? {
        childNodes: menuToTreeContents(items, t),
        icon: 'folder-close',
      } : {}),

      ...rest,
    }));

export const AppSummary = ({ t, menu = [], permissions = [] }) => (
  <Tree contents={menuToTreeContents(menu, t, permissions)} />
);

AppSummary.defaultProps = {
  permissions: [],
  menu: [],
  t: text => text,
};

AppSummary.propTypes = {
  permissions: PropTypes.arrayOf(PropTypes.string),
  menu: PropTypes.arrayOf(PropTypes.shape({
    ...Tree.propTypes,
    href: PropTypes.string,
    label: PropTypes.string.isRequired,
    requiredPermissions: PropTypes.string,
  })),
  t: PropTypes.func,
};

export default compose(
  withNamespaces(),
  withPermissions,
)(AppSummary);
