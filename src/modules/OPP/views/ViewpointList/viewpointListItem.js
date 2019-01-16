import React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { Card } from '@blueprintjs/core';

import './viewpoint-list.scss';

export const ViewpointListItem = ({
  id,
  label,
  picture: { list: src },
  location: { pathname },
}) => (
  <Card interactive>
    <NavLink to={`${pathname}/${id}`}>
      <img src={src} alt="" />
      <h5>{label}</h5>
    </NavLink>
  </Card>
);

export default withRouter(ViewpointListItem);
