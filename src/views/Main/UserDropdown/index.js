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
import { AppContext } from '../../../components/AppProvider';

export const UserDropdown = ({ user: { email } = {}, logoutAction, t }) => {
  const { env: { ssoAuth: { logoutUrl } = {} } = {} } = React.useContext(AppContext);
  const logoutLink = (logoutUrl && logoutUrl.startsWith('/')) ? logoutUrl.substring(1) : logoutUrl;

  return (
    <Popover
      content={(
        <Menu>
          <MenuItem
            className={Classes.MINIMAL}
            onClick={() => logoutAction(logoutLink)}
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
};

export default connectAuthProvider('user', 'logoutAction')(withTranslation()(UserDropdown));
