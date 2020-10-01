import React from 'react';
import Paper from '@material-ui/core/Paper';

const Placeholder = ({ children }) => (
  <div style={{ display: 'flex', justifyContent: 'center', padding: '2em' }}>
    <Paper style={{ padding: '2em' }}>{children}</Paper>
  </div>
);

export default Placeholder;
