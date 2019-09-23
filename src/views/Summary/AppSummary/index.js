import React from 'react';
import { NavLink } from 'react-router-dom';
import { withNamespaces } from 'react-i18next';

import { Tree } from '@blueprintjs/core';

const menuToTreeContents = (menu = [], t = text => text) =>
  menu.map(({ items = [], label, href, ...rest }, index) => ({
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

export const AppSummary = ({ t, menu = [] }) => (
  <Tree contents={menuToTreeContents(menu, t)} />
);

export default withNamespaces()(AppSummary);
