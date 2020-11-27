import React, { useMemo, useContext, useCallback } from 'react';
import PropTypes from 'prop-types';

import { useTranslation } from 'react-i18next';

import {
  Button,
  Intent,
  Position,
  Popover,
  PopoverInteractionKind,
} from '@blueprintjs/core';
import ColumnsSelector from '@terralego/core/modules/Table/components/ColumnsSelector';
import { UserSettingsContext, TABLE_MINIFIED, TABLE_MEDIUM, TABLE_FULL } from '../../../services/UserSettingsProvider';

import Search from '../Search';

const resizeButtonsProps = [
  { action: TABLE_FULL, icon: 'maximize' },
  { action: TABLE_MEDIUM, icon: 'minimize' },
  { action: TABLE_MINIFIED, icon: 'minus', text: 'hide' },
];

const Actions = ({
  columns,
  onChange,
  onHeaderChange,
}) => {
  const { t } = useTranslation();
  const {
    setTableSize,
    tableSize = TABLE_MEDIUM,
  } = useContext(UserSettingsContext);

  const popoverProps = useMemo(() => ({
    interactionKind: PopoverInteractionKind.HOVER,
    position: tableSize === TABLE_FULL ? Position.BOTTOM : Position.TOP,
    boundary: 'window',
  }), [tableSize]);

  const displayTableFilters = useMemo(() => (
    Boolean(columns.length) && tableSize !== TABLE_MINIFIED
  ), [columns.length, tableSize]);

  const handleChange = useCallback(props => {
    onChange(props);
    onHeaderChange(props);
  }, [onChange, onHeaderChange]);

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
              onChange={handleChange}
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
};

Actions.defaultProps = {
  columns: [],
  displayAddFeature: false,
  layerName: '',
  onChange: () => {},
  onHeaderChange: () => {},
};

export default Actions;
