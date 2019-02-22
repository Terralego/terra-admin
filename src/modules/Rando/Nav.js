import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';

import { connectRandoProvider } from './services/RandoProvider';
import config from './config';


export const Nav = ({ getAllLayersAction, layersList }) => {
  useEffect(() => {
    getAllLayersAction();
  }, []);
  return (
    <ul>
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
  );
};

export default connectRandoProvider('getAllLayersAction', 'layersList')(Nav);
