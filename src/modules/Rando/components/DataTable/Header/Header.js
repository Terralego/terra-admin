import React from 'react';
import { Intent, Position, Popover, PopoverInteractionKind, Button } from '@blueprintjs/core';
import ColumnsSelector from '@terralego/core/modules/Table/components/ColumnsSelector';
import { withNamespaces } from 'react-i18next';

import './styles.scss';

const Header = ({ source, full, resize, t, columns, onChange }) => (
  <div className="table-header">
    <div className="table-header__title">{t('rando.table.title')} {source}</div>
    <div>
      <Popover
        content="Filtrer les propriétés"
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

export default withNamespaces()(Header);
