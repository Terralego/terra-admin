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
    <Card interactive className="card-card">
      <img
        className="card-picture"
        src={(picture && picture.list) || noPhoto}
        alt={label}
      />
      <div className="card-body">
        <h3 className="card-title">{id} / {label}</h3>
      </div>
    </Card>
  </NavLink>
);

export default withRouter(ViewpointsListItem);
