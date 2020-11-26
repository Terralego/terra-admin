import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles({
  valueList: {
    display: 'flex',
    '& > *': {
      margin: '5px',
    },
    '& input': {
      width: '3em',
    },
    '& .action': {
      width: '25px',
      height: '25px',
      backgroundColor: 'none',
      border: '1px dotted #ccc',
      padding: '0px',
    },
  },
});

const ValueListField = ({ value, onChange }) => {
  const classes = useStyles();

  const handleValueChange = index => event => {
    const newValueList = [...value];
    const newValue = parseFloat(event.target.value);

    newValueList[index] = Number.isNaN(newValue) ? newValueList[index] : newValue;

    onChange(newValueList);
  };

  const addValue = () => {
    const newValueList = [...value];
    newValueList.push(newValueList[newValueList.length - 1] + 1);
    onChange(newValueList);
  };

  const removeValue = index => () => {
    const newValueList = [...value];
    newValueList.splice(index, 1);
    onChange(newValueList);
  };

  return (
    <div className={classes.valueList}>
      {(value || []).map((val, index) => (
        <TextField
          type="number"
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          value={val}
          onChange={handleValueChange(index)}
        />
      ))}
      <button type="button" className="action" onClick={removeValue(value.length - 1)}>
        -
      </button>
      <button type="button" className="action" onClick={addValue}>
        +
      </button>
    </div>
  );
};

export default ValueListField;
