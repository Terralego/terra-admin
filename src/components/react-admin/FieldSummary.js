import React from 'react';
import { withTranslation } from 'react-i18next';

import FieldSample from './FieldSample';

const FieldSummary = ({ t, record, record: { name, label, type } }) => (
  <div>
    <p style={{ fontSize: '1.2em', fontWeight: 'bold' }}>
      {label && `${label} (${name})`}
      {!label && `${name}`}
    </p>
    {type && <p><strong>{t('datalayer.form.type')}:</strong> {type}</p>}
    <FieldSample record={record} />
  </div>
);

export default withTranslation()(FieldSummary);
