import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { Icon } from '@blueprintjs/core';

import { generateURI } from '../../../config';

import NavIcon from '../NavIcon';

const NavItem = ({ name, pictogram, layer, displayPictogram, displayAddFeature }) => (
  <div className="CRUD-nav__action">
    <NavLink
      className="CRUD-nav__link"
      to={generateURI('layer', { layer: layer.name })}
    >
      <span className="CRUD-nav__item-content">
        <span className="bp3-button bp3-minimal">
          {displayPictogram && <NavIcon src={pictogram} />}
          <span className="bp3-button-text">{name}</span>
        </span>
      </span>
    </NavLink>
    {displayAddFeature && (
      <NavLink
        className="CRUD-nav__add"
        to={generateURI('layer', { layer: layer.name, action: 'create' })}
      >
        <span className="CRUD-nav__item-content">
          <span className="bp3-button bp3-minimal">
            <Icon icon="add" color="#666" />
          </span>
        </span>
      </NavLink>
    )}
  </div>
);

export default NavItem;

NavItem.propTypes = {
  name: PropTypes.string.isRequired,
  pictogram: PropTypes.string,
  layer: PropTypes.shape({
    name: PropTypes.string,
  }),
  displayPictogram: PropTypes.bool,
  displayAddFeature: PropTypes.bool,
};

NavItem.defaultProps = {
  pictogram: undefined,
  layer: {
    name: undefined,
  },
  displayPictogram: false,
  displayAddFeature: false,
};
