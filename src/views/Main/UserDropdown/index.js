import React from 'react';
import {
  NavbarGroup,
  Button,
  Classes,
  Popover,
  Menu,
  MenuItem,
  Position,
} from '@blueprintjs/core';
import { connectAuthProvider } from 'mc-tf-test/modules/Auth';
import { withNamespaces } from 'react-i18next';

export const UserDropdown = ({ user, logoutAction, t }) => (
  <NavbarGroup align="right">
    <Popover
      content={(
        <Menu>
          <MenuItem
            className={Classes.MINIMAL}
            onClick={logoutAction}
            icon="log-out"
            text={t('main.logout')}
          />
          <MenuItem
            icon="wrench"
            text={t('main.account')}
          />
        </Menu>
      )}
      position={Position.BOTTOM_RIGHT}
    >
      <Button
        className={Classes.MINIMAL}
        icon="user"
        rightIcon="caret-down"
        text={user.email}
      />
    </Popover>
  </NavbarGroup>
);

export default connectAuthProvider('user', 'logoutAction')(withNamespaces()(UserDropdown));
