import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { Icon, Popover, PopoverInteractionKind, Position } from '@blueprintjs/core';

import { generateURI } from '../../../config';

import NavIcon from '../NavIcon';

const NavAddFeature = ({ withPopover, children, t }) => {
  if (!withPopover) {
    return children;
  }

  return (
    <Popover
      content={t('CRUD.details.create')}
      interactionKind={PopoverInteractionKind.HOVER}
      position={Position.RIGHT}
      boundary="window"
    >
      {children}
    </Popover>
  );
};


const NavItem = ({ name, pictogram, layer, minified, displayAddFeature, t }) => (
  <div className="CRUD-nav__action">
    <NavLink
      className="CRUD-nav__link"
      to={generateURI('layer', { layer: layer.name })}
    >
      <span className="CRUD-nav__item-content">
        <span className="bp3-button bp3-minimal">
          {!minified && <NavIcon src={pictogram} />}
          <span className="bp3-button-text">{name}</span>
        </span>
      </span>
    </NavLink>
    {displayAddFeature && (
      <NavAddFeature withPopover={!minified} t={t}>
        <NavLink to={generateURI('layer', { layer: layer.name, action: 'create' })}>
          <span className="CRUD-nav__item-content">
            <span className="bp3-button bp3-minimal">
              <Icon icon="add" color="#666" />
            </span>
          </span>
        </NavLink>
      </NavAddFeature>
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
  minified: PropTypes.bool,
  displayAddFeature: PropTypes.bool,
  t: PropTypes.func,
};

NavItem.defaultProps = {
  pictogram: undefined,
  layer: {
    name: undefined,
  },
  minified: false,
  displayAddFeature: false,
  t: text => text,
};
