import React from 'react';
import AppSummary from './AppSummary';

export const Summary = ({ modules }) => (
  <div className="summary">
    {modules.map(({ name, config }) => (
      <AppSummary
        key={name}
        name={name}
        {...config}
      />
    ))}
  </div>
);

export default Summary;
