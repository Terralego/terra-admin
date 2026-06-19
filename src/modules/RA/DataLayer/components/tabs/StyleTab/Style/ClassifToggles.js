import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import styles from './styles';

const useStyles = makeStyles(styles);

const ClassifToggles = ({ showOptions, onToggle }) => {
  const classes = useStyles();

  return (
    <div className={classes.toggles}>
      <label htmlFor="discret-toggle-mean">
        <input id="discret-toggle-mean" type="checkbox" checked={showOptions.mean} onChange={onToggle('mean')} />
        Moyenne
      </label>
      <label htmlFor="discret-toggle-median">
        <input id="discret-toggle-median" type="checkbox" checked={showOptions.median} onChange={onToggle('median')} />
        Médiane
      </label>
      <label htmlFor="discret-toggle-stddev">
        <input id="discret-toggle-stddev" type="checkbox" checked={showOptions.stddev} onChange={onToggle('stddev')} />
        Écart-type
      </label>
    </div>
  );
};

export default ClassifToggles;
