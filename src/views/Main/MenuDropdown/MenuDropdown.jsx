import React from 'react';

import {
  Button,
  Classes,
  Popover,
  Menu,
  Position,
} from '@blueprintjs/core';

import MenuTree from '../../../components/MenuTree';
import useUserSettings from '../../../hooks/useUserSettings';

const byModule = modules => ({ requiredModule }) => {
  if (!requiredModule) {
    return true;
  }

  return modules.includes(requiredModule);
};

export const MenuDropdown = ({ t, modules = [], enabledModules = [], requiredPermissions }) => {
  const { hasPermission } = useUserSettings();

  const menuContent = modules.reduce((acc, { config: { menu = [] } = {} }) => [
    ...acc,
    ...menu,
  ], []).filter(byModule(enabledModules));

  if (requiredPermissions && !hasPermission(requiredPermissions)) {
    return null;
  }

  if (!menuContent.length) {
    return null;
  }

  return (
    <Popover
      position={Position.BOTTOM_RIGHT}
      content={(
        <Menu>
          {menuContent.map(menuProps => <MenuTree key={menuProps.label} {...menuProps} />)}
        </Menu>
      )}
    >
      <Button
        className={Classes.MINIMAL}
        icon="menu"
        rightIcon="caret-down"
        text={t('common.modules')}
      />
    </Popover>
  );
};

export default MenuDropdown;
