
import React from 'react';
import { sortableHandle } from 'react-sortable-hoc';

import { makeStyles } from '@material-ui/core/styles';
import DragIndicator from '@material-ui/icons/DragIndicator';

const useStyles = makeStyles({
  handle: {
    position: 'relative',
    margin: '2px',
    width: '30px',
    display: 'flex',
    alignItems: 'center',
    marginRight: '20px',
    cursor: 'row-resize',
  },
});


const DragHandle = sortableHandle(({ withBorder = false }) => {
  const style = {};
  if (withBorder) {
    style.border = '2px solid #e0e0e0';
  }
  const classes = useStyles();
  return (<span className={classes.handle} style={style}><DragIndicator /></span>);
});


export default DragHandle;
