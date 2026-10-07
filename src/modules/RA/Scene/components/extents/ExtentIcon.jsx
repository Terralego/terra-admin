import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import PublicIcon from '@material-ui/icons/Public';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 'none',
  },
  themed: ({ src }) => ({
    backgroundColor: theme.palette.primary.main,
    maskImage: `url("${src}")`,
    WebkitMaskImage: `url("${src}")`,
    maskSize: 'contain',
    WebkitMaskSize: 'contain',
    maskRepeat: 'no-repeat',
    WebkitMaskRepeat: 'no-repeat',
    maskPosition: 'center',
    WebkitMaskPosition: 'center',
  }),
  file: {
    objectFit: 'contain',
  },
}));

const ExtentIcon = ({ extent, size = 24, className }) => {
  const { icon: src, adaptToTheme } = extent || {};
  const classes = useStyles({ src });
  const style = { width: size, height: size };
  const wrapper = [classes.root, className].filter(Boolean).join(' ');

  if (!src) {
    return (
      <span className={wrapper} style={style}>
        <PublicIcon color="disabled" style={style} />
      </span>
    );
  }

  if (adaptToTheme) {
    return <span className={`${wrapper} ${classes.themed}`} style={style} />;
  }

  return (
    <span className={wrapper} style={style}>
      <img src={src} alt="" width={size} height={size} className={classes.file} />
    </span>
  );
};

export default ExtentIcon;
