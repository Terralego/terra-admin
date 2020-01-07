import React from 'react';
import {
  Button,
  Icon,
  Intent,
  Position,
  Popover,
  PopoverInteractionKind,
  Spinner,
  Tag,
} from '@blueprintjs/core';
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
  featuresList,
  loading,
}) => {
  const popoverProps = {
    interactionKind: PopoverInteractionKind.HOVER,
    position: tableSize === 'full' ? Position.BOTTOM : Position.TOP,
    boundary: 'window',
  };
  const showLoader = Array.isArray(featuresList) && loading;
  const showCount = Array.isArray(featuresList) && !loading;

  return (
    <div className="table-header">
      <div className="table-header__title">
        {t('CRUD.table.title', { layerName })}
        {displayAddFeature && (
        <NavLink className="table-header__create" to={generateURI('layer', { layer, action: 'create' })}>
          <span className="bp3-button">
            <Icon icon="add" />
            <span className="bp3-button-text"> {t('CRUD.details.create')}</span>
          </span>
        </NavLink>
        )}
      </div>
      {showLoader && <Spinner size="20" />}
      {showCount && (
        <Tag intent={Intent.PRIMARY} round>
          {featuresList.length > 1
            ? t('CRUD.table.results_plural', { count: featuresList.length })
            : t('CRUD.table.results', { count: featuresList.length })
          }
        </Tag>
      )}
      <div>
        {!!columns.length && tableSize !== 'minified' && (
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
        )}
        <Popover
          content={tableSize === 'minified' ? t('CRUD.table.showTable') : t('CRUD.table.hideTable')}
          {...popoverProps}
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
          {...popoverProps}
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
};

export default Header;
