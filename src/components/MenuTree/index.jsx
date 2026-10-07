import React from 'react';
import { NavLink } from 'react-router-dom';

import { withTranslation } from 'react-i18next';
import { MenuItem } from '@blueprintjs/core';
import useUserSettings from '../../hooks/useUserSettings';

const byPermissions = hasPermission => ({ requiredPermissions }) => {
  if (!requiredPermissions) {
    return true;
  }
  return hasPermission(requiredPermissions);
};


export const MenuTree = ({ t, href, items: unfilteredItems = [], label }) => {
  const { hasPermission } = useUserSettings();

  const items = React.useMemo(
    () =>
      unfilteredItems.filter(byPermissions(hasPermission)),
    [hasPermission, unfilteredItems],
  );

  if (!items.length) {
    if (!href) {
      return <MenuItem text={t(label)} />;
    }

    return (
      <NavLink key={href} to={href}>
        <MenuItem tagName="span" text={t(label)} />
      </NavLink>
    );
  }

  return (
    <MenuItem text={t(label)}>
      {items.map(item => <MenuTree t={t} key={item.label} {...item} />)}
    </MenuItem>
  );
};

export default withTranslation()(MenuTree);
