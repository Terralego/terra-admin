import React from 'react';

import randomColor from 'randomcolor';
import { useTranslate, SelectInput, required } from 'react-admin';
import { makeStyles } from '@material-ui/core/styles';
import FormLabel from '@material-ui/core/FormLabel';
import TextField from '@material-ui/core/TextField';
import { Field, useField } from 'react-final-form';

import ValueListField from './ValueListField';
import { DEFAULT_MAX_CLASSES } from './ColorListField';

import StatsPreview from './StatsPreview';
import DistribPreview from './DistribPreview';
import DiscretPreview from './DiscretPreview';

import styles from './styles';

const isRequired = [required()];

const useStyles = makeStyles(styles);

const defValue = [1, 2, 3];

const GraduateValue = ({ path, Component = ValueListField,
  defaultValue = defValue,
  layerName }) => {
  const translate = useTranslate();
  const classes = useStyles();

  const { input: { value: values, onChange: onValuesChange } }
    = useField(`${path}.values`, { subscription: { value: true } });
  const v = Array.isArray(values) && values.length > 0 ? values : defaultValue;

  const handleCountChange = e => {
    let newCount = parseInt(e.target.value, 10);
    if (Number.isNaN(newCount)) return;
    newCount = Math.max(2, Math.min(newCount, DEFAULT_MAX_CLASSES));
    const old = v;
    if (newCount > old.length) {
      const added = Array.from(
        { length: newCount - old.length },
        () => randomColor(),
      );
      onValuesChange([...old, ...added]);
    } else if (newCount < old.length) {
      onValuesChange(old.slice(0, newCount));
    }
  };

  return (
    <>
      <div className={classes.graduateConfig}>
        <div className="method">
          <SelectInput
            source={`${path}.method`}
            label="style-editor.graduate.method.input"
            validate={isRequired}
            choices={[
              { id: 'jenks', name: translate('style-editor.graduate.method.jenks') },
              { id: 'quantile', name: translate('style-editor.graduate.method.quantiles') },
              { id: 'equal_interval', name: translate('style-editor.graduate.method.equal-interval') },
              /* { id: 'manual', name: translate('style-editor.graduate.method.manual') }, */
            ]}
          />
        </div>
        <div className="count">
          <TextField
            type="number"
            label="Classes"
            value={v.length}
            onChange={handleCountChange}
            inputProps={{ min: 2, max: DEFAULT_MAX_CLASSES, step: 1 }}
            margin="dense"
          />
        </div>
      </div>

      <FormLabel>{translate('style-editor.graduate.steps')}</FormLabel>
      <Field name={`${path}.values`} defaultValue={defaultValue}>
        {({ input: { value, onChange } }) => (
          <Component value={value} onChange={onChange} showAddRemove={false} />
        )}
      </Field>

      <div style={{ display: 'flex', gap: 16 }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <StatsPreview layerName={layerName} path={path} />
        </div>
        <div style={{ flex: 2, display: 'flex', flexDirection: 'column' }}>
          <DistribPreview layerName={layerName} path={path} />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', marginTop: 16 }}>
        <DiscretPreview layerName={layerName} path={path} />
      </div>
    </>
  );
};

export default GraduateValue;
