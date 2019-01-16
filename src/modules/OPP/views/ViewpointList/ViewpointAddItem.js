import React from 'react';
import { Card, Classes } from '@blueprintjs/core';
import { withNamespaces } from 'react-i18next';

import './viewpoint-list.scss';

export const ViewpointAddItem = ({ t }) => (
  <Card interactive className={Classes.DARK}>
    <p>{t('main.add')}</p>
  </Card>
);

export default withNamespaces()(ViewpointAddItem);
