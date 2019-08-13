import React from 'react';

const NavIcon = ({ src, alt = '', ...rest }) => src && (
  <span className="bp3-icon" {...rest}>
    <img className="CRUD-nav__icon" src={src} alt={alt} />
  </span>
);

export default NavIcon;
