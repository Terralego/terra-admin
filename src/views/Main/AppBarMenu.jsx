import React from 'react';

/* eslint-disable import/no-extraneous-dependencies */
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { makeStyles } from '@material-ui/core/styles';
/* eslint-enable */

const useStyles = makeStyles({
  button: {
    textTransform: 'none',
    fontWeight:    400,
  },
});

/**
 * Bouton de la barre d'application qui ouvre un menu sous lui, aligné à
 * droite. `children` reçoit la fonction qui referme le menu, à appeler après
 * un choix.
 */
export const AppBarMenu = ({ icon, label, children }) => {
  const classes = useStyles();
  const [anchor, setAnchor] = React.useState(null);
  const close = React.useCallback(() => setAnchor(null), []);

  return (
    <>
      <Button
        color="inherit"
        className={classes.button}
        startIcon={icon}
        endIcon={<ArrowDropDownIcon />}
        aria-haspopup="true"
        onClick={event => setAnchor(event.currentTarget)}
      >
        {label}
      </Button>
      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={close}
        // Sans ça, MUI v4 superpose le menu au bouton au lieu de l'ouvrir dessous
        getContentAnchorEl={null}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {children(close)}
      </Menu>
    </>
  );
};

export default AppBarMenu;
