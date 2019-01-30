import React from 'react';
import { Card, Classes } from '@blueprintjs/core';
import { withNamespaces } from 'react-i18next';
import { Link } from 'react-router-dom';

import '../viewpoint-list.scss';

export const AddViewpoint = ({ t }) => (
  <Card interactive className={Classes.DARK}>
    <Link to="viewpoints/create">{t('main.add')}</Link>
  </Card>
);

export default withNamespaces()(AddViewpoint);
