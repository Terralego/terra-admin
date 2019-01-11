import React from 'react';
import { NavLink } from 'react-router-dom';

export const Nav = () => (
  <ul>
    <li><NavLink to="/opp/foo">Foo</NavLink></li>
    <li><NavLink to="/opp/bar">Bar</NavLink></li>
    <li><NavLink to="/opp/ViewpointList">Liste</NavLink></li>
  </ul>
);

export default Nav;
