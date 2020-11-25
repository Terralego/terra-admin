import React from 'react';

import { useTranslate, SelectInput, BooleanInput } from 'react-admin';
import { makeStyles } from '@material-ui/core/styles';
import FormLabel from '@material-ui/core/FormLabel';
import { Field } from 'react-final-form';

import ValueListField from './ValueListField';

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

const defValue = [1];

const GraduateValue = ({ path, Component = ValueListField, defaultValue = defValue }) => {
  const translate = useTranslate();
  const classes = useStyles();
  // const [defaultValue] = React.useState([1]);

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

      <FormLabel>Steps</FormLabel>
      <Field name={`${path}.values`} defaultValue={defaultValue}>
        {({ input: { value, onChange } }) => (
          <Component value={value} onChange={onChange} />
        )}
      </Field>
      <BooleanInput source={`${path}.generate_legend`} />
    </div>
  );
};

export default GraduateValue;
