import React from 'react';
import { Card } from '@blueprintjs/core';

import AppSummary from './AppSummary';

import './Summary.scss';

export const Summary = ({ modules }) => (
  <div className="summary">
    <Card className="summary-tree">
      {modules.map(({ name, config }) => (
        <AppSummary key={name} name={name} {...config} />
      ))}
    </Card>
  </div>
);

export default Summary;
