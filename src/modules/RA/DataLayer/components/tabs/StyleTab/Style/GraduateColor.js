
import React from 'react';

import { useTranslate, SelectInput } from 'react-admin';

import { makeStyles } from '@material-ui/core/styles';

import FormLabel from '@material-ui/core/FormLabel';

import { Field } from 'react-final-form';

import ColorListField from './ColorListField';


const useStyles = makeStyles({
  configLine: {
    display: 'flex',
    alignItems: 'center',
    padding: '1em 0',
    width: '50%',
    '& > .grow': {
      flex: 1,
    },
  },
  graduateConfig: {
    display: 'flex',
    '& .method': {
      width: '20em',
      marginRight: '3em',
    },
    '& .count': {
      flex: '1',
    },
  },
});

const GraduateColor = ({ path }) => {
  const translate = useTranslate();
  const classes = useStyles();
  const [defaultColorValue] = React.useState(['#ffccff']);

  return (
    <div style={{ width: '50%' }}>
      <div className={classes.graduateConfig}>

        <SelectInput
          source={`${path}.method`}
          choices={[
            { id: 'jenks', name: translate('datalayer.form.styles.jenks') },
            { id: 'quantile', name: translate('datalayer.form.styles.quantiles') },
            { id: 'equal_interval', name: translate('datalayer.form.styles.equal-interval') },
            { id: 'manual', name: translate('datalayer.form.styles.manual') },
          ]}
        />
      </div>

      <FormLabel>Colors</FormLabel>
      <Field name={`${path}.values`} defaultValue={defaultColorValue}>
        {({ input: { value, onChange } }) => (
          <ColorListField value={value} onChange={onChange} />
        )}
      </Field>
    </div>
  );
};

export default GraduateColor;
