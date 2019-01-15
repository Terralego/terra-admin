import React from 'react';
// import { NavLink, withRouter } from 'react-router-dom';
import { Card, Classes } from '@blueprintjs/core';

import './viewpoint-list.scss';

export const ViewpointAddItem = () => (
  <Card interactive className={Classes.DARK}>
    <p>Ajouter</p>
  </Card>
);

export default ViewpointAddItem;
