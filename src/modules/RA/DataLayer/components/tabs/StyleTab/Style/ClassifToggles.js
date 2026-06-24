import React from 'react';
import { useTranslate } from 'react-admin';
import { makeStyles } from '@material-ui/core/styles';

import styles from './styles';

const useStyles = makeStyles(styles);

const ClassifToggles = ({ showOptions, onToggle }) => {
  const translate = useTranslate();
  const classes = useStyles();

  return (
    <div className={classes.toggles}>
      <label htmlFor="discret-toggle-mean">
        <input id="discret-toggle-mean" type="checkbox" checked={showOptions.mean} onChange={onToggle('mean')} />
        {translate('discret.toggle.mean')}
      </label>
      <label htmlFor="discret-toggle-median">
        <input id="discret-toggle-median" type="checkbox" checked={showOptions.median} onChange={onToggle('median')} />
        {translate('discret.toggle.median')}
      </label>
      <label htmlFor="discret-toggle-stddev">
        <input id="discret-toggle-stddev" type="checkbox" checked={showOptions.stddev} onChange={onToggle('stddev')} />
        {translate('discret.toggle.stddev')}
      </label>
    </div>
  );
};

export default ClassifToggles;
