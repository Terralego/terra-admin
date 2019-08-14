import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Button, Icon } from '@blueprintjs/core';
import classnames from 'classnames';

import { generateURI } from '../../config';

import './styles.scss';


export const Nav = ({ getAllLayersAction, resizingMap, layersList, t }) => {
  const [menuOpen, setMenuOpen] = useState(true);

  useEffect(() => {
    getAllLayersAction();
  }, []);

  useEffect(() => {
    resizingMap();
  }, [menuOpen]);

  const layersListByGroups = layersList.reduce((list, item) => {
    const matchingGroup = list.find(({ group }) => group === item.group);
    if (matchingGroup) {
      return list.map(listItem => (listItem !== matchingGroup
        ? listItem
        : {
          ...listItem,
          list: [
            ...listItem.list,
            item,
          ],
        }));
    }
    return [...list, { group: item.group, list: [item] }];
  }, []);

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
          icon="align-right"
          aria-controls="CRUD-nav__menu"
          expandable={menuOpen ? 'true' : 'false'}
          aria-label={t(menuOpen ? 'CRUD.nav.foldMenu' : 'CRUD.nav.unfoldMenu')}
          onClick={() => setMenuOpen(!menuOpen)}
          minimal
        />
      </div>
      <ul
        id="CRUD-nav__menu"
        className="CRUD-nav__menu"
      >
        {layersListByGroups.map(({ group, list }) => (
          <li className="CRUD-nav__group" key={group}>
            <p className="CRUD-nav__group-name">
              {group}
            </p>
            <ul className="CRUD-nav__list">
              {list.map(({ name }) => (
                <li className="CRUD-nav__item" key={name}>
                  <NavLink
                    to={generateURI('layer', { layer: name })}
                  >
                    <span className="bp3-button bp3-minimal">
                      <Icon icon="layout" />
                      <span className="bp3-button-text">{name}</span>
                    </span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Nav;
