import React from 'react';
import {
  Button,
  Icon,
  Intent,
  Position,
  Popover,
  PopoverInteractionKind,
  Spinner,
} from '@blueprintjs/core';
import ColumnsSelector from '@terralego/core/modules/Table/components/ColumnsSelector';
import { NavLink } from 'react-router-dom';

import { TABLE_MINIFIED, TABLE_MEDIUM, TABLE_FULL } from '../../../services/UserSettingsProvider';
import { generateURI } from '../../../config';

import './styles.scss';

const Header = ({
  layerName,
  tableSize,
  setTableSize,
  t,
  columns,
  onHeaderChange,
  match: { params: { layer } },
  displayAddFeature,
  featuresList: { count } = {},
}) => {
  const popoverProps = {
    interactionKind: PopoverInteractionKind.HOVER,
    position: tableSize === TABLE_FULL ? Position.BOTTOM : Position.TOP,
    boundary: 'window',
  };
  const resizeButtonsProps = [
    { action: TABLE_FULL, icon: 'maximize' },
    { action: TABLE_MEDIUM, icon: 'minimize' },
    { action: TABLE_MINIFIED, icon: 'minus', text: 'hide' },
  ];

  return (
    <div className="table-header">
      <div className="table-header__title">
        {!count && <Spinner className="table-header__spinner" size={Spinner.SIZE_SMALL} tagName="span" />}
        <span>{t('CRUD.table.results', { count })}</span>
        <strong>{layerName}</strong>
        {displayAddFeature && (
        <NavLink className="table-header__create" to={generateURI('layer', { layer, action: 'create' })}>
          <span className="bp3-button bp3-minimal">
            <Icon icon="add" />
            <span className="bp3-button-text"> {t('CRUD.details.create')}</span>
          </span>
        </NavLink>
        )}
      </div>
      <div>
        {!!columns.length && tableSize !== TABLE_MINIFIED && (
        <Popover
          content={t('CRUD.table.filterProps')}
          {...popoverProps}
        >
          <ColumnsSelector
            columns={columns}
            onChange={onHeaderChange}
            position={Position.LEFT}
            locales={{
              displayAllColumns: t('CRUD.table.columnsDisplay'),
              hideAllColumns: t('CRUD.table.columnsHide'),
            }}
          />
        </Popover>
        )}
        <Popover
          content={(
            <div className="table-header__resize">
              {resizeButtonsProps.map(({ action, icon, text = icon }) => (
                <Button
                  active={tableSize === action}
                  key={action}
                  icon={icon}
                  minimal
                  onClick={() => setTableSize(action)}
                  text={t(`CRUD.table.${text}`)}
                />
              ))}
            </div>
            )}
          {...popoverProps}
        >
          <Button
            icon="arrows-vertical"
            minimal
            intent={Intent.PRIMARY}
          />
        </Popover>
      </div>
    </div>
  );
};

export default Header;
