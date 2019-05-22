import React from 'react';
import { Intent, Position, Popover, PopoverInteractionKind, Button, Icon } from '@blueprintjs/core';
import ColumnsSelector from '@terralego/core/modules/Table/components/ColumnsSelector';
import { NavLink } from 'react-router-dom';
import { generateURI } from '../../../config';

import './styles.scss';

const Header = ({ source, full, resize, t, columns, onChange, match: { params: { layer } } }) => (
  <div className="table-header">
    <div className="table-header__title">
      {t('rando.table.title', { source })}
      <NavLink className="table-header__create" to={generateURI('layer', { layer, action: 'create' })}>
        <span className="bp3-button">
          <Icon icon="plus" />
          <span className="bp3-button-text"> {t('rando.details.create')}</span>
        </span>
      </NavLink>
    </div>
    <div>
      <Popover
        content={t('rando.table.filterProps')}
        interactionKind={PopoverInteractionKind.HOVER}
      >
        <ColumnsSelector
          columns={columns}
          onChange={onChange}
          position={Position.LEFT}
          locales={{
            displayAllColumns: t('rando.table.columnsDisplay'),
            hideAllColumns: t('rando.table.columnsHide'),
          }}
        />
      </Popover>
      <Popover
        content={full ? t('rando.table.minimize') : t('rando.table.maximize')}
        interactionKind={PopoverInteractionKind.HOVER}
      >
        <Button
          onClick={() => resize(!full)}
          icon={full ? 'minimize' : 'maximize'}
          minimal
          active={full}
          intent={Intent.PRIMARY}
        />
      </Popover>
    </div>
  </div>
);

export default Header;
