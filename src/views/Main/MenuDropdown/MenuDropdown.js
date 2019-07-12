import React from 'react';
import {
  Button,
  Classes,
  Popover,
  Menu,
  MenuItem,
  Position,
} from '@blueprintjs/core';

export const MenuDropdown = ({ t, modules = [], history: { push } }) => {
  const [{ config: { nav = [] } = {} } = {}] = modules;
  if (modules.length <= 1 && nav.length <= 1) {
    return null;
  }
  return (
    <Popover
      content={(
        <Menu>
          {modules.map(Component => (
            <MenuItem
              key={Component.name}
              className={Classes.MINIMAL}
              text={t(Component.config.title)}
            >
              {Component.config.nav.map(item => (
                <MenuItem
                  key={item.href}
                  text={t(item.label)}
                  onClick={() => push(`${Component.config.path}/${item.href}`)}
                />
              ))}
            </MenuItem>
          ))}
        </Menu>
      )}
      position={Position.BOTTOM_RIGHT}
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
