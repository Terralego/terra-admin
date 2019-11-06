import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Collapse, Button, Popover, PopoverInteractionKind, Position } from '@blueprintjs/core';

import NavItem from '../NavItem';
import NavIcon from '../NavIcon';

const NavGroup = ({
  navCollapsed,
  name: groupName,
  pictogram: groupPictogram,
  collapsed,
  views,
}) => {
  const [open, toggleGroup] = useState(collapsed);
  return (
    <li className="CRUD-nav__group">
      <Button
        className="CRUD-nav__group-button"
        alignText="left"
        onClick={() => toggleGroup(!open)}
        icon={<NavIcon isGroup src={groupPictogram} />}
        rightIcon={open ? 'small-minus' : 'small-plus'}
        minimal
        text={navCollapsed ? '' : groupName}
      />
      <Collapse
        isOpen={open}
      >
        <ul className="CRUD-nav__list">
          {views.length > 0 && views.map(view => (
            <li className="CRUD-nav__item" key={view.name}>
              {navCollapsed ? (
                <Popover
                  interactionKind={PopoverInteractionKind.HOVER}
                  position={Position.LEFT}
                  boundary="window"
                  content={<NavItem {...view} />}
                >
                  <NavIcon src={view.pictogram} />
                </Popover>
              ) : (
                <NavItem {...view} displayPictogram />
              )}
            </li>
          ))}
        </ul>
      </Collapse>
    </li>
  );
};

export default NavGroup;

NavGroup.propTypes = {
  navCollapsed: PropTypes.bool,
  name: PropTypes.string,
  pictogram: PropTypes.string,
  collapsed: PropTypes.bool,
  views: PropTypes.arrayOf(PropTypes.shape({})),
};

NavGroup.defaultProps = {
  navCollapsed: false,
  name: undefined,
  pictogram: undefined,
  collapsed: false,
  views: [],
};
