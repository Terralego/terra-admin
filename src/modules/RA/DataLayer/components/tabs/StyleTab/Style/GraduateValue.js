import React from 'react';

import { useTranslate, SelectInput, required } from 'react-admin';
import { makeStyles } from '@material-ui/core/styles';
import FormLabel from '@material-ui/core/FormLabel';
import { Field } from 'react-final-form';

import ValueListField from './ValueListField';

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

  return (
    <>
      <div className={classes.graduateConfig}>
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

      <FormLabel>{translate('style-editor.graduate.steps')}</FormLabel>
      <Field name={`${path}.values`} defaultValue={defaultValue}>
        {({ input: { value, onChange } }) => (
          <Component value={value} onChange={onChange} />
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
