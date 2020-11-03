import React from 'react';

import FieldItem from './FieldItem';

const MiniSheetFieldTree = ({ fieldTree }) => (
  <div className="wrapper">
    {fieldTree.map(field => (
      field && <FieldItem field={field} key={field.parent.sourceFieldId} />
    ))}
  </div>
);
export default MiniSheetFieldTree;
