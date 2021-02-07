import React from 'react';

import { useTranslate } from 'react-admin';
import { useField, useForm } from 'react-final-form';

import { makeStyles } from '@material-ui/core/styles';
import { SortableContainer } from 'react-sortable-hoc';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/AddCircleOutline';
import DeleteIcon from '@material-ui/icons/Delete';
import UpIcon from '@material-ui/icons/ArrowUpward';
import DownIcon from '@material-ui/icons/ArrowDownward';
import { v4 as uuid } from 'uuid';
import LegendField from './LegendField';


const useStyles = makeStyles({
  legends: {
    listStyleType: 'none',
    margin: 0,
    padding: 0,
    '& .legend': {
      display: 'flex',
      borderBottom: '1px solid #eee',
    },
    '& .actions': {
      display: 'flex',
      textAlign: 'center',
      flexDirection: 'column',
      backgroundColor: '#eee',
      margin: '0.5em 1em 0.5em 0',
      borderRadius: '0.5em',
    },
  },
});

const defaultMap = [];

const LegendTab = SortableContainer(() => {
  const classes = useStyles();
  const translate = useTranslate();
  const { input: { value: legends } } = useField('legends');
  const form = useForm();

  const handleMove = React.useCallback(({ oldIndex, newIndex }) => {
    const { values: { legends: formLegends } } = form.getState();
    if (oldIndex !== newIndex) {
      const newLegends = [...formLegends];
      newLegends.splice(newIndex, 0, newLegends.splice(oldIndex, 1)[0]);
      form.change('legends', newLegends);
    }
  }, [form]);

  const handleRemove = React.useCallback(index => {
    const { values: { legends: formLegends } } = form.getState();
    const newLegends = [...formLegends];
    newLegends.splice(index, 1);
    form.change('legends', newLegends);
  }, [form]);

  const handleAdd = React.useCallback(() => {
    const { values: { legends: formLegends = [] } } = form.getState();
    const newLegends = [...formLegends];
    newLegends.push({ uid: uuid() });
    form.change('legends', newLegends);
  }, [form]);

  return (
    <>
      <ul className={classes.legends}>
        {legends && legends.map((legend, index) => (
          <li className="legend" key={`${legend.uid}`}>
            <div className="actions">
              <h2>{index + 1}</h2>
              <Button
                onClick={() => { handleMove({ oldIndex: index, newIndex: index - 1 }); }}
                disabled={index <= 0}
              >
                <UpIcon />
              </Button>
              <Button
                onClick={() => { handleMove({ oldIndex: index, newIndex: index + 1 }); }}
                disabled={index >= legends.length - 1}
              >
                <DownIcon />
              </Button>
              <Button
                onClick={() => { handleRemove(index); }}
                disabled={legend.auto}
              >
                <DeleteIcon />
              </Button>
            </div>
            <LegendField source={`legends.${index}`} />
          </li>
        ))}
      </ul>
      <Button
        onClick={handleAdd}
      >
        <AddIcon />
        {translate('ra.action.add')}
      </Button>
    </>
  );
});

export default LegendTab;
