import React from 'react';
import { Card, Classes } from '@blueprintjs/core';
import { withNamespaces } from 'react-i18next';
import { Link } from 'react-router-dom';

import './add-viewpoint.scss';

export const AddViewpoint = ({ t }) => (
  <Link className="card-link card-link--add" to="viewpoints/create">
    <Card interactive className={`card-card item--add ${Classes.DARK}`}>
      <div className="card-add">
        <span className="add">+</span>
        <h3 className="card-title">{t('common.add')}</h3>
      </div>
    </Card>
  </Link>
);

export default withNamespaces()(AddViewpoint);
