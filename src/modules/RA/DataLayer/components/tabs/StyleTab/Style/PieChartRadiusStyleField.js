import React, { useMemo } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { useField } from 'react-final-form';
import { SelectInput, NumberInput, required } from 'react-admin';
import { fieldTypes } from '../../../../../DataSource';

import Condition from '../../../../../../../components/react-admin/Condition';
import FieldOption from '../../FieldOption';

import styles from './styles';

const isRequired = [required()];

const useStyles = makeStyles(styles);

const PieChartRadiusStyleField = ({ path, fields }) => {
  const classes = useStyles();

  const {
    input: { value: type },
  } = useField(`${path}.type`);

  const memoizedFields = useMemo(() => fields
    .filter(field => ['Integer', 'Float'].includes(fieldTypes[field.data_type]))
    .map(field => ({
      id: field.name,
      label: `${field.label || field.name}`,
      name: field.name,
      type: fieldTypes[field.data_type],
    })), [fields]);

  if (type === 'none') {
    return null;
  }

  return (
    <div className={classes.styleField}>
      <Condition when={`${path}.type`} is="fixed">
        <NumberInput
          source={`${path}.value`}
          label="style-editor.fixed.diameter"
          defaultValue={30}
        />
      </Condition>

      <Condition when={`${path}.type`} is="variable">
        {fields && (
          <>
            <SelectInput
              source={`${path}.field`}
              helperText="style-editor.field-help"
              style={{ minWidth: '20em', margin: '1em 0' }}
              label="style-editor.field"
              validate={isRequired}
              optionText={<FieldOption />}
              choices={memoizedFields}
            />
            <NumberInput
              source={`${path}.min_radius`}
              defaultValue={10}
              label="style-editor.proportionnal.min-diameter"
            />
            <NumberInput
              source={`${path}.max_radius`}
              defaultValue={50}
              label="style-editor.proportionnal.max-diameter"
            />
          </>
        )}
      </Condition>
    </div>
  );
};

export default PieChartRadiusStyleField;
