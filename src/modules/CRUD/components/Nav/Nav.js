import React, { useState, useEffect, useMemo, useContext } from 'react';
import { Button } from '@blueprintjs/core';
import { useTranslation } from 'react-i18next';
import classnames from 'classnames';

import { CRUDContext } from '../../services/CRUDProvider';
import { MapContext } from '../../services/MapProvider';
import NavGroup from './NavGroup';

import './styles.scss';

const sortBy = prop => ({ [prop]: orderA }, { [prop]: orderB }) =>
  (typeof orderA === 'number' ? orderA : Infinity) - (typeof orderB === 'number' ? orderB : Infinity);

const sortByOrder = sortBy('order');

export const Nav = () => {
  const { map } = useContext(MapContext);
  const { settings: { menu } = {} } = useContext(CRUDContext);

  const { t } = useTranslation();

  const [menuOpen, setMenuOpen] = useState(true);

  const orderedMenu = useMemo(() => (
    menu && menu
      .reduce((group, menuItem) => {
        const { id, crud_views: views } = menuItem;
        return [
          ...group,
          ({ views: views.sort(sortByOrder), collapsed: (id !== null), ...menuItem }),
        ];
      }, [])
      .filter(({ crud_views: views }) => views.length)
      .sort(sortByOrder)
  ), [menu]);

  useEffect(() => {
    map && map.resize();
  }, [map, menuOpen]);

  if (!menu) {
    return null;
  }

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
          expandable={menuOpen.toString()}
          aria-label={t(menuOpen ? 'CRUD.nav.foldMenu' : 'CRUD.nav.unfoldMenu')}
          onClick={() => setMenuOpen(prevMenOpen => !prevMenOpen)}
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
