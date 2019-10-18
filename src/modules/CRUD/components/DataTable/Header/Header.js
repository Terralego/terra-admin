import React from 'react';
import { Intent, Position, Popover, PopoverInteractionKind, Button, Icon } from '@blueprintjs/core';
import ColumnsSelector from '@terralego/core/modules/Table/components/ColumnsSelector';
import { NavLink } from 'react-router-dom';
import { generateURI } from '../../../config';

import './styles.scss';

const Header = ({
  layerName,
  tableSize,
  resize,
  t,
  columns,
  onChange,
  onHeaderChange,
  match: { params: { layer } },
  displayAddFeature,
}) => (
  <div className="table-header">
    <div className="table-header__title">
      {t('CRUD.table.title', { layerName })}
      {displayAddFeature && (
        <NavLink className="table-header__create" to={generateURI('layer', { layer, action: 'create' })}>
          <span className="bp3-button">
            <Icon icon="plus" />
            <span className="bp3-button-text"> {t('CRUD.details.create')}</span>
          </span>
        </NavLink>
      )}
    </div>
    <div>
      {!!columns.length && tableSize !== 'minified' && (
        <Popover
          content={t('CRUD.table.filterProps')}
          interactionKind={PopoverInteractionKind.HOVER}
        >
          <ColumnsSelector
            columns={columns}
            onChange={props => {
              onChange(props);
              onHeaderChange(props);
            }}
            position={Position.LEFT}
            locales={{
              displayAllColumns: t('CRUD.table.columnsDisplay'),
              hideAllColumns: t('CRUD.table.columnsHide'),
            }}
          />
        </Popover>
      )}
      <Popover
        content={tableSize === 'minified' ? t('CRUD.table.showTable') : t('CRUD.table.hideTable')}
        interactionKind={PopoverInteractionKind.HOVER}
      >
        <Button
          onClick={() => resize(tableSize === 'minified' ? 'medium' : 'minified')}
          icon={tableSize === 'minified' ? 'arrow-up' : 'arrow-down'}
          minimal
          intent={Intent.PRIMARY}
        />
      </Popover>
      <Popover
        content={tableSize === 'full' ? t('CRUD.table.minimize') : t('CRUD.table.maximize')}
        interactionKind={PopoverInteractionKind.HOVER}
      >
        <Button
          onClick={() => resize(tableSize === 'full' ? 'medium' : 'full')}
          icon={tableSize === 'full' ? 'minimize' : 'maximize'}
          minimal
          active={tableSize === 'full'}
          intent={Intent.PRIMARY}
        />
      </Popover>
    </div>
  </div>
);

export default Header;
