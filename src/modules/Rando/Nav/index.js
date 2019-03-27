import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '@blueprintjs/core';
import classnames from 'classnames';

import { connectRandoProvider } from '../services/RandoProvider';
import config from '../config';

import './styles.scss';


export const Nav = ({ getAllLayersAction, resizingMap, layersList }) => {
  const [menuOpen, setMenuOpen] = useState(true);
  useEffect(() => {
    getAllLayersAction();
  }, []);
  useEffect(() => {
    resizingMap();
  }, [menuOpen]);
  return (
    <div
      className={classnames(
        'rando-nav',
        { 'rando-nav--active': menuOpen },
      )}
    >
      <div
        className="rando-nav__button"
      >
        <Button
          icon="align-right"
          aria-controls="rando-nav__menu"
          expandable={menuOpen ? 'true' : 'false'}
          aria-label={menuOpen ? 'Replier le menu' : 'Déplier le menu'}
          onClick={() => setMenuOpen(!menuOpen)}
          minimal
        />
      </div>
      <ul
        id="rando-nav__menu"
        className="rando-nav__menu"
      >
        {layersList.map(({ name }) => (
          <li key={name}>
            <NavLink
              to={`${config.path}/map/layer/${name}`}
            >
              {name}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default connectRandoProvider('getAllLayersAction', 'layersList', 'resizingMap')(Nav);
