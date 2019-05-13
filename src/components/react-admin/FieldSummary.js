import React from 'react';
import FieldSample from './FieldSample';

const FieldSummary = ({ record, record: { name, label, type } }) => (
  <div>
    <p style={{ fontSize: '1.2em', fontWeight: 'bold' }}>
      {label && `${label} (${name})`}
      {!label && `${name}`}
    </p>
    {type && <p><strong>Type:</strong> {type}</p>}
    <FieldSample record={record} />
  </div>
);

export default FieldSummary;
