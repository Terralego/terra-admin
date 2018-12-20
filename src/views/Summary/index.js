import React from 'react';

import AppSummary from './AppSummary';
import modules from '../../modules';

const summary = Object.keys(modules).map(name => ({
  name,
  ...modules[name].default.config,
}));

export const Summary = () => (
  <div className="summary">
    {summary.map(({ name, ...config }) => (
      <AppSummary
        key={name}
        name={name}
        {...config}
      />
    ))}
  </div>
);

export default Summary;
