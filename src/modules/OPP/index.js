import React from 'react';
import { NavLink } from 'react-router-dom';

import config from './config';
import NavLayout from '../../components/NavLayout';
import Routing from '../../components/Routing';

const Foo = () => import('./Foo');
const Bar = () => import('./Bar');

const { path } = config;

export const OPP = () => (
  <NavLayout
    nav={(
      <ul>
        <li><NavLink to="/opp/foo">Foo</NavLink></li>
        <li><NavLink to="/opp/bar">Bar</NavLink></li>
      </ul>
    )}
  >
    <Routing
      routes={[{
        path: `${path}/foo`,
        import: Foo,
      }, {
        path: `${path}/bar`,
        import: Bar,
      }]}
    />
  </NavLayout>
);

OPP.config = config;

export default OPP;
