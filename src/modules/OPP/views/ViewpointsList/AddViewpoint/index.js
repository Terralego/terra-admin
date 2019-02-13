import React from 'react';
import { Card } from '@blueprintjs/core';
import { withNamespaces } from 'react-i18next';
import { Link } from 'react-router-dom';

export const AddViewpoint = ({ t }) => (
  <Link className="card-link--add" to="viewpoints/create">
    <Card interactive className="item--add">
      <p>{t('common.add')}</p>
    </Card>
  </Link>
);

export default withNamespaces()(AddViewpoint);
