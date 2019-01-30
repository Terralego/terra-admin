import React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { Card } from '@blueprintjs/core';

import './viewpoint-list.scss';
import noPhoto from '../../images/no_photo.png';

export const ViewpointsListItem = ({
  id,
  label,
  picture,
  location: { pathname },
}) => (
  <Card interactive>
    <NavLink to={`${pathname}/${id}`}>
      { picture ? (
        <img src={picture.list} alt="" />
      ) : (
        <img src={noPhoto} alt="" />
      )}
      <h3>{id} / {label}</h3>
    </NavLink>
  </Card>
);

export default withRouter(ViewpointsListItem);
