import React from 'react';

import './styles.scss';

export const NavLayout = ({ nav, children }) => (
  <div className="nav-layout">
    <div className="nav-layout__nav">
      {nav}
    </div>
    <div className="nav-layout__content">
      {children}
    </div>
  </div>
);

export default NavLayout;
