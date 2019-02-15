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
  <NavLink className="card-link" to={`${pathname}/${id}`}>
    <Card interactive>
      <img src={(picture && picture.list) || noPhoto} alt="" />
      <h3>{id} / {label}</h3>
    </Card>
  </NavLink>
);

export default withRouter(ViewpointsListItem);
