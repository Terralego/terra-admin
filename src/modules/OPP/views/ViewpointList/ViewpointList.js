import React from 'react';
import {
  H2,
} from '@blueprintjs/core';
//import { withNamespaces } from 'react-i18next';

import ViewpointListItem from './viewpointListItem';

import './viewpoint-list.scss';

export const ViewpointList = ({ viewpoints = [] }) => (
  <>
    <div className="pageTitle">
      <H2>Les points de vue</H2>
    </div>
    <div className="viewpoint-list">
      {viewpoints.map(viewpoint => (
        <ViewpointListItem
          {...viewpoint}
        />
      ))}
    </div>
  </>
);

export default ViewpointList;
