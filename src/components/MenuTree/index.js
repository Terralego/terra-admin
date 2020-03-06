import React from 'react';
import { NavLink } from 'react-router-dom';

import { withTranslation } from 'react-i18next';
import { MenuItem } from '@blueprintjs/core';

export const MenuTree = ({ t, href, items = [], label }) => {
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
