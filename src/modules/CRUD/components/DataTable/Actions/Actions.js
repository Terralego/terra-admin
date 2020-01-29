import React from 'react';
import PropTypes from 'prop-types';

import {
  Button,
  Intent,
  Position,
  Popover,
  PopoverInteractionKind,
} from '@blueprintjs/core';
import ColumnsSelector from '@terralego/core/modules/Table/components/ColumnsSelector';

import { TABLE_MINIFIED, TABLE_MEDIUM, TABLE_FULL } from '../../../services/UserSettingsProvider';
import Search from '../Search';

const Actions = ({
  columns,
  onChange,
  onHeaderChange,
  setTableSize,
  t,
  tableSize,
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
  const displayTableFilters = !!columns.length && tableSize !== TABLE_MINIFIED;

  return (
    <div className="table-header__actions">
      {displayTableFilters && (
        <>
          <Search />
          <Popover
            content={t('CRUD.table.filterProps')}
            {...popoverProps}
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
        </>
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
  );
};

Actions.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.object),
  displayAddFeature: PropTypes.bool,
  layerName: PropTypes.string,
  onChange: PropTypes.func,
  onHeaderChange: PropTypes.func,
  setTableSize: PropTypes.func,
  t: PropTypes.func,
  tableSize: PropTypes.string,
};

Actions.defaultProps = {
  columns: [],
  displayAddFeature: false,
  layerName: '',
  onChange: () => {},
  onHeaderChange: () => {},
  setTableSize: () => {},
  t:  () => {},
  tableSize: 'medium',
};

export default Actions;
