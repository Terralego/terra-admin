import React from 'react';

import { ArrayInput, SimpleFormIterator } from 'react-admin';

import { useField } from 'react-final-form';

import { makeStyles } from '@material-ui/core/styles';
import LegendField from './LegendField';


const useStyles = makeStyles({
  legend: {
    '& > ul > li > p': {
      backgroundColor: '#eee',
      margin: '2px',
      marginRight: '0.5em',
      borderRadius: '0.5em',
      textAlign: 'center',
    },
  },
});


const LegendTab = () => {
  useField('settings.advanced_legend', { defaultValue: true });
  const style = useStyles();

  return (
    <ArrayInput
      source="legends"
      label="Legends"
      fullWidth
      className={style.legend}
    >
      <SimpleFormIterator>
        <LegendField />
      </SimpleFormIterator>
    </ArrayInput>
  );
};

export default LegendTab;
