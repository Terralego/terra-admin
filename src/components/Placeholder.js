import React from 'react';
import Paper from '@material-ui/core/Paper';

const Placeholder = ({ style = {}, paperStyle = {}, ...rest }) => (
  <div style={{ display: 'flex', justifyContent: 'center', padding: '2em', ...style }}>
    <Paper style={{ padding: '2em', ...paperStyle }} {...rest} />
  </div>
);

export default Placeholder;
