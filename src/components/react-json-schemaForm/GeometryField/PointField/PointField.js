import React, { useState } from 'react';
import { FormGroup, InputGroup } from '@blueprintjs/core';
import PropTypes from 'prop-types';

const Label = ({ name, required }) => (
  <>
    <span>{name}</span>
    {required && <span>*</span>}
  </>
);

const PointField = ({
  idSchema: { coordinates: { $ids } },
  formData,
  onChange,
  t,
  schema: {
    required = [],
  },
  disabled,
}) => {
  const [coords, setCoords] = useState(formData.coordinates);
  const isRequired = required.includes('coordinates');


  const handleChange = index => ({ target: { value } }) => {
    const coordinates = [...coords];
    coordinates[index] = Number(value);
    setCoords(coordinates);
    onChange({ ...formData, coordinates });
  };

  return (
    <div>
      {['latitude', 'longitude'].map((name, index) => (
        <FormGroup
          key={name}
          label={(
            <Label name={t(`jsonSchema.geometryField.${name}`)} required={isRequired} />
          )}
          labelFor={`${$ids}-${index}`}
        >
          <InputGroup
            id={`${$ids}-${index}`}
            disabled={disabled}
            defaultValue={coords[index]}
            onChange={handleChange(index)}
            required={isRequired}
            type="number"
          />
        </FormGroup>
      ))}
    </div>
  );
};

PointField.propTypes = {
  idSchema: PropTypes.shape({
    coordinates: PropTypes.shape({
      $ids: PropTypes.string,
    }),
  }),
  formData: PropTypes.shape({
    coordinates: PropTypes.arrayOf(PropTypes.number),
  }),
  onChange: PropTypes.func,
  t: PropTypes.func,
};

PointField.defaultProps = {
  idSchema: {
    coordinates: {
      $ids: 'root',
    },
  },
  formData: {
    coordinates: [],
  },
  onChange: () => {},
  t: text => text,
};

export default PointField;
