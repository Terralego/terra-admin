import React from 'react';
import {
  Button,
  Classes,
  Popover,
  Menu,
  MenuItem,
  Position,
} from '@blueprintjs/core';
import { withNamespaces } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { connectAppProvider } from '../../../components/AppProvider';
import { getModulesComponentsByPermissions } from '../../../services/modules';

export const MenuDropdown = ({ t, permissions, history: { push } }) => (
  <Popover
    content={(
      <Menu>
        {getModulesComponentsByPermissions(permissions).map(Component => (
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

export default connectAppProvider(
  ({ env: { permissions } }) => ({ permissions }),
)(withNamespaces()(withRouter(MenuDropdown)));
