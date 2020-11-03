import React from 'react';
import { makeStyles } from '@material-ui/core';

import FieldRow from './FieldRow';

const useStyles = makeStyles({
  fieldList: {
    display: 'flex',
    flexDirection: 'column',
  },
});

const SectionFieldList = ({ sectionFields }) => {
  const classes = useStyles();
  return (
    <div className={classes.fieldList}>
      {sectionFields.map(sectionField => (
        <FieldRow
          key={sectionField.sourceFieldId}
          field={sectionField}
          onChange={() => {}}
          add={() => {}}
        />
      ))}
    </div>
  );
};
export default SectionFieldList;
