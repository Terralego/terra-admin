import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '@blueprintjs/core';
import classnames from 'classnames';

import { generateURI } from '../../config';
import NavIcon from './NavIcon';

import './styles.scss';

const sortByOrder = ({ order: orderA }, { order: orderB }) =>
  (orderA !== null ? orderA : Infinity) - (orderB !== null ? orderB : Infinity);

const getFilteredAndOrderedMenu = menu => menu && (
  menu.reduce((group, menuItem) => {
    const { name, crud_views: views } = menuItem;
    return (name !== 'Unclassified')
      ? [...group, ({ views: views.sort(sortByOrder), ...menuItem })]
      : group;
  },
  []).filter(({ crud_views: views }) => views.length).sort(sortByOrder)
);

export const Nav = ({
  settings: { menu } = {},
  resizingMap,
  t,
}) => {
  const [menuOpen, setMenuOpen] = useState(true);
  const [orderedMenu, setOrderedMenu] = useState(menu);

  useEffect(resizingMap, [menuOpen]);
  useEffect(() => setOrderedMenu(getFilteredAndOrderedMenu(menu)), [menu]);

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
          icon={`arrow-${menuOpen ? 'left' : 'right'}`}
          aria-controls="CRUD-nav__menu"
          expandable={menuOpen ? 'true' : 'false'}
          aria-label={t(menuOpen ? 'CRUD.nav.foldMenu' : 'CRUD.nav.unfoldMenu')}
          onClick={() => setMenuOpen(!menuOpen)}
          minimal
        />
      </div>
      { orderedMenu && (
        <ul
          id="CRUD-nav__menu"
          className="CRUD-nav__menu"
        >
          {orderedMenu.map(({ name: group, pictogram: groupPictogram, views }) => (
            <li className="CRUD-nav__group" key={group}>
              <p className="CRUD-nav__group-name">
                <NavIcon src={groupPictogram} />
                <span className="CRUD-nav__group-text">{group}</span>
              </p>
              <ul className="CRUD-nav__list">
                {views.map(({ name, pictogram, layer }) => (
                  <li className="CRUD-nav__item" key={name}>
                    <NavLink
                      className="CRUD-nav__link"
                      to={generateURI('layer', { layer: layer.name })}
                    >
                      <span className="bp3-button bp3-minimal">
                        <NavIcon src={pictogram} />
                        <span className="bp3-button-text">{name}</span>
                      </span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Nav;
