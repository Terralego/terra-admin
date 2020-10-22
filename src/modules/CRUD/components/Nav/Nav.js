import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@blueprintjs/core';
import classnames from 'classnames';

import NavGroup from './NavGroup';

import './styles.scss';

const sortBy = prop => ({ [prop]: orderA }, { [prop]: orderB }) =>
  (typeof orderA === 'number' ? orderA : Infinity) - (typeof orderB === 'number' ? orderB : Infinity);

const sortByOrder = sortBy('order');

const getOrderedMenu = menu => menu && (
  menu.reduce((group, menuItem) => {
    const { id, crud_views: views } = menuItem;
    return [...group, ({ views: views.sort(sortByOrder), collapsed: (id !== null), ...menuItem })];
  },
  []).filter(({ crud_views: views }) => views.length).sort(sortByOrder)
);

export const Nav = ({
  settings: { menu } = {},
  t,
}) => {
  const [menuOpen, setMenuOpen] = useState(true);
  const [orderedMenu, setOrderedMenu] = useState(getOrderedMenu(menu));

  useEffect(() => setOrderedMenu(getOrderedMenu(menu)), [menu]);

  return (
    <div
      className={classnames(
        'CRUD-nav',
        { 'CRUD-nav--active': menuOpen },
      )}
    >
      <div
        className="CRUD-nav__button"
      >
        <Button
          icon={menuOpen ? 'menu-closed' : 'menu-open'}
          aria-controls="CRUD-nav__menu"
          expandable={menuOpen ? 'true' : 'false'}
          aria-label={t(menuOpen ? 'CRUD.nav.foldMenu' : 'CRUD.nav.unfoldMenu')}
          onClick={() => setMenuOpen(!menuOpen)}
          minimal
        />
      </div>
      {orderedMenu && (
        <ul
          id="CRUD-nav__menu"
          className="CRUD-nav__menu"
        >
          {orderedMenu.map(groupList => (
            <NavGroup
              key={groupList.id}
              navCollapsed={!menuOpen}
              {...groupList}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default Nav;

Nav.propTypes = {
  settings: PropTypes.shape({
    menu: PropTypes.array,
  }),
  t: PropTypes.func,
};

Nav.defaultProps = {
  settings: {
    menu: [],
  },
  t: text => text,
};
