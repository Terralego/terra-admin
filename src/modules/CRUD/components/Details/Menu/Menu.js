import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import classnames from 'classnames';
import {
  Classes,
  Navbar,
  NavbarGroup,
  Icon,
} from '@blueprintjs/core';

import { generateURI } from '../../../config';

const nav = [
  { section: 'default', text: 'CRUD.details.menu.default', icon: 'list-detail-view' },
  { section: 'geometries', text: 'CRUD.details.menu.geometries', icon: 'polygon-filter' },
  { section: 'attachment', text: 'CRUD.details.menu.attachment', icon: 'paperclip', disabled: true },
];

const MenuItem = ({
  children,
  section,
  disabled,
  match: { params: { id, layer } },
}) => {
  if (!disabled) {
    return (
      <NavLink
        key={section}
        to={generateURI('layer', { layer, id, section })}
      >
        {children}
      </NavLink>
    );
  }
  return children;
};

const Menu = ({
  section,
  match,
  t,
}) => (
  <Navbar className="details__menu">
    <NavbarGroup>
      {nav.map(({ icon, text, ...props }) => (
        <MenuItem key={props.section} match={match} {...props}>
          <span className={classnames({
            [Classes.BUTTON]: true,
            [Classes.MINIMAL]: true,
            [Classes.DISABLED]: props.disabled,
            [Classes.ACTIVE]: props.section === section,
          })}
          >
            {icon && <Icon icon={icon} />}
            <span className="bp3-button-text"> {t(text)}</span>
          </span>
        </MenuItem>
      ))}
    </NavbarGroup>
  </Navbar>
);

Menu.propTypes = {
  section: PropTypes.oneOf(['default', 'geometries', 'attachment']),
  match: PropTypes.shape({
    params: PropTypes.shape({
      layer: PropTypes.string,
      id: PropTypes.string,
      action: PropTypes.string,
    }),
  }),
  t: PropTypes.func,
};

Menu.defaultProps = {
  section: 'default',
  match: {
    params: {
      layer: undefined,
      id: undefined,
    },
  },
  t: text => text,
};

export default Menu;
