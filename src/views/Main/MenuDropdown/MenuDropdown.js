import React from 'react';

import {
  Button,
  Classes,
  Popover,
  Menu,
  Position,
} from '@blueprintjs/core';

import MenuTree from '../../../components/MenuTree';

const byModule = enabledModules => ({ requiredModule }) => {
  if (!requiredModule) {
    return true;
  }

  return enabledModules.includes(requiredModule);
};

export const MenuDropdown = ({ t, modules = [], enabledModules = [] }) => {
  const menuContent = modules.reduce((acc, { config: { menu = [] } = {} }) => [
    ...acc,
    ...menu,
  ], []).filter(byModule(enabledModules));

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
