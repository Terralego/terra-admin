import React from 'react';
import {
  H2,
} from '@blueprintjs/core';

import ViewpointListItem from './ViewpointListItem';
import ViewpointAddItem from './ViewpointAddItem';
import './viewpoint-list.scss';

export const ViewpointList = ({ viewpoints = [] }) => (
  <>
    <div className="page--title">
      <H2>Les points de vue</H2>
    </div>
    <div className="viewpoint-list">
      <ViewpointAddItem />
      {viewpoints.map(viewpoint => (
        <ViewpointListItem
          key={viewpoint.id}
          {...viewpoint}
        />
      ))}
    </div>
  </>
);

export default ViewpointList;
