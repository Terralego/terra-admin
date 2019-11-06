import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@blueprintjs/core';

const NavIcon = ({ src, alt = '', isGroup, className = '', ...rest }) =>
  (src
    ? (
      <span {...rest} className={`${className} bp3-icon`}>
        <img className="CRUD-nav__icon" src={src} alt={alt} />
      </span>
    )
    : <Icon {...rest} className={className} icon={isGroup ? 'layers' : 'layer'} color="#333" />
  );

export default NavIcon;

NavIcon.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  isGroup: PropTypes.bool,
};

NavIcon.defaultProps = {
  src: undefined,
  alt: undefined,
  isGroup: false,
};
