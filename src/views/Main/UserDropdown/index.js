import React from 'react';
import {
  Button,
  Classes,
  Popover,
  Menu,
  MenuItem,
  Position,
} from '@blueprintjs/core';
import { connectAuthProvider } from '@terralego/core/modules/Auth';
import { withTranslation } from 'react-i18next';

export const UserDropdown = ({ user: { email } = {}, logoutAction, t }) => (
  <Popover
    content={(
      <Menu>
        <MenuItem
          className={Classes.MINIMAL}
          onClick={logoutAction}
          icon="log-out"
          text={t('common.logout')}
        />
      </Menu>
      )}
    position={Position.BOTTOM_RIGHT}
  >
    <Button
      className={Classes.MINIMAL}
      icon="user"
      rightIcon="caret-down"
      text={email}
    />
  </Popover>
);

export default connectAuthProvider('user', 'logoutAction')(withTranslation()(UserDropdown));
