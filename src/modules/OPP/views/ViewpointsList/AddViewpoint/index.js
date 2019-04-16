import React from 'react';
import { Card } from '@blueprintjs/core';
import { withNamespaces } from 'react-i18next';
import { Link } from 'react-router-dom';

import './add-viewpoint.scss';

export const AddViewpoint = ({ t }) => (
  <Link className="card-link--add" to="viewpoints/create">
    <Card interactive className="item--add">
      <div>
        <p>{t('common.add')}</p>
      </div>
    </Card>
  </Link>
);

export default withNamespaces()(AddViewpoint);
