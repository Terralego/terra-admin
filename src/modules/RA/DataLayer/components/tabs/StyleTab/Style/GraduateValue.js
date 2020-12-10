import React from 'react';

import { useTranslate, SelectInput } from 'react-admin';
import { makeStyles } from '@material-ui/core/styles';
import FormLabel from '@material-ui/core/FormLabel';
import { Field } from 'react-final-form';

import ValueListField from './ValueListField';

import styles from './styles';

const useStyles = makeStyles(styles);

const defValue = [1];

const GraduateValue = ({ path, Component = ValueListField, defaultValue = defValue }) => {
  const translate = useTranslate();
  const classes = useStyles();

  return (
    <>
      <div className={classes.graduateConfig}>
        <SelectInput
          source={`${path}.method`}
          label="style-editor.graduate.method.input"
          choices={[
            { id: 'jenks', name: translate('style-editor.graduate.method.jenks') },
            { id: 'quantile', name: translate('style-editor.graduate.method.quantiles') },
            { id: 'equal_interval', name: translate('style-editor.graduate.method.equal-interval') },
            /* { id: 'manual', name: translate('style-editor.graduate.method.manual') }, */
          ]}
        />
      </div>

      <FormLabel>{translate('style-editor.graduate.steps')}</FormLabel>
      <Field name={`${path}.values`} defaultValue={defaultValue}>
        {({ input: { value, onChange } }) => (
          <Component value={value} onChange={onChange} />
        )}
      </Field>
    </>
  );
};

export default GraduateValue;
