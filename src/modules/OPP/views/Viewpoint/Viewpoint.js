import React from 'react';
import {
  H2,
} from '@blueprintjs/core';

import ViewpointData from './ViewpointData';

export const Viewpoint = ({ viewpoint }) => (
  <>
    <div className="page--title">
      <H2>{viewpoint.label}</H2>
    </div>
    <div className="page--content">
      <ViewpointData {...viewpoint} />
    </div>
  </>
);

export default Viewpoint;
