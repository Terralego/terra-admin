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
  { section: 'attachmentFiles', text: 'CRUD.details.menu.attachmentFiles', icon: 'paperclip' },
  { section: 'attachmentImages', text: 'CRUD.details.menu.attachmentImages', icon: 'media' },
];

const Menu = ({
  section,
  match: { params: { layer, id, action = 'read' } },
  t,
}) => (
  <Navbar className="details__menu">
    <NavbarGroup>
      {nav.map(({ text, icon, section: itemSection }) => (
        <NavLink
          key={itemSection}
          to={generateURI('layer', { layer, id, action, section: itemSection })}
        >
          <span className={classnames(
            Classes.BUTTON,
            Classes.MINIMAL,
            { [Classes.ACTIVE]: itemSection === section },
          )}
          >
            {icon && <Icon icon={icon} />}
            <span className="bp3-button-text"> {t(text)}</span>
          </span>
        </NavLink>
      ))}
    </NavbarGroup>
  </Navbar>
);

Menu.propTypes = {
  section: PropTypes.oneOf(['default', 'attachmentFiles', 'attachmentImages']),
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
      action: 'read',
    },
  },
  t: text => text,
};

export default Menu;
