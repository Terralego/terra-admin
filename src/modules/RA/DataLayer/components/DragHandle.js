
import React from 'react';
import { sortableHandle } from 'react-sortable-hoc';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  handle: {
    position: 'relative',
    top: '1px',
    display: 'block',
    width: '18px',
    height: '11px',
    opacity: '.25',
    marginRight: '20px',
    cursor: 'row-resize',
    background: 'linear-gradient(180deg,#000,#000 20%,#fff 0,#fff 40%,#000 0,#000 60%,#fff 0,#fff 80%,#000 0,#000)',
  },
});


const DragHandle = sortableHandle(() => {
  const classes = useStyles();
  return (<span className={classes.handle} />);
});


export default DragHandle;
