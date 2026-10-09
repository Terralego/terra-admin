import React from 'react';
import { withTranslation } from 'react-i18next';

/* eslint-disable import/no-extraneous-dependencies */
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
/* eslint-enable */

import { connectAuthProvider } from '../../../terra-front/Auth';
import AppBarMenu from '../AppBarMenu';

export const UserDropdown = ({ user: { email } = {}, logoutAction, t }) => (
  <AppBarMenu icon={<AccountCircleIcon />} label={email}>
    {close => (
      <MenuItem
        onClick={() => {
          close();
          logoutAction();
        }}
      >
        <ListItemIcon><ExitToAppIcon fontSize="small" /></ListItemIcon>
        <ListItemText primary={t('common.logout')} />
      </MenuItem>
    )}
  </AppBarMenu>
);

export default connectAuthProvider('user', 'logoutAction')(withTranslation()(UserDropdown));
