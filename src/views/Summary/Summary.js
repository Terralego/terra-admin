import React from 'react';

import { getModulesComponentsByPermissions } from '../../services/modules';
import AppSummary from './AppSummary';


export const Summary = ({ permissions }) => (
  <div className="summary">
    {getModulesComponentsByPermissions(permissions).map(Component => (
      <AppSummary
        key={Component.name}
        name={Component.name}
        {...Component.config}
      />
    ))}
  </div>
);

export default Summary;
