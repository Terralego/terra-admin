import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import classnames from 'classnames';
import {
  Alignment,
  Classes,
  Navbar,
  NavbarGroup,
  Icon,
} from '@blueprintjs/core';

import { generateURI } from '../../../config';
import DeleteFeature from '../DeleteFeature';

const nav = [
  { section: 'default', text: 'CRUD.details.menu.default', icon: 'list-detail-view' },
  { section: 'geometries', text: 'CRUD.details.menu.geometries', icon: 'polygon-filter' },
  { section: 'attachments', text: 'CRUD.details.menu.attachments', icon: 'paperclip' },
];

const Menu = ({
  section,
  match: { params: { id, layer } },
  t,
}) => (
  <Navbar className="details__menu">
    <NavbarGroup>
      {nav.map(({ icon, text, ...props }) => (
        <NavLink
          key={props.section}
          to={generateURI('layer', { layer, id, section: props.section })}
        >
          <span className={classnames({
            [Classes.BUTTON]: true,
            [Classes.MINIMAL]: true,
            [Classes.ACTIVE]: props.section === section,
          })}
          >
            {icon && <Icon icon={icon} />}
            <span className="bp3-button-text"> {t(text)}</span>
          </span>
        </NavLink>
      ))}
    </NavbarGroup>
    <NavbarGroup align={Alignment.RIGHT}>
      <DeleteFeature />
    </NavbarGroup>
  </Navbar>
);

Menu.propTypes = {
  section: PropTypes.oneOf(['default', 'geometries', 'attachments']),
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
