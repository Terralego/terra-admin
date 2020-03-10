import React, { useState } from 'react';
import { FormGroup, InputGroup } from '@blueprintjs/core';
import PropTypes from 'prop-types';

const PointField = ({ idSchema: { coordinates: { $ids } }, formData, onChange, t }) => {
  const [coords, setCoords] = useState(formData.coordinates);

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
          label={t(`jsonSchema.geometryField.${name}`)}
          labelFor={`${$ids}-${index}`}
        >
          <InputGroup
            id={`${$ids}-${index}`}
            type="number"
            defaultValue={coords[index]}
            onChange={handleChange(index)}
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
