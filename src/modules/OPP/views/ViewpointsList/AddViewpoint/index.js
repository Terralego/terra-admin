import React from 'react';
import { Card, Classes } from '@blueprintjs/core';
import { withNamespaces } from 'react-i18next';
import { Link } from 'react-router-dom';

export const AddViewpoint = ({ t }) => (
  <Card interactive className={Classes.DARK}>
    <Link to="viewpoints/create">{t('common.add')}</Link>
  </Card>
);

export default withNamespaces()(AddViewpoint);
