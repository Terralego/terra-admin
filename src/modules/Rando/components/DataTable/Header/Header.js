import React from 'react';
import { Intent, Popover, PopoverInteractionKind, Button } from '@blueprintjs/core';
import { withNamespaces } from 'react-i18next';

import './styles.scss';

const Header = ({ source, full, resize, t }) => (
  <div className="table-header">
    <div className="table-header__title">{t('rando.table.title')} {source}</div>
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
);

export default withNamespaces()(Header);
