import React, { useEffect, useCallback, useRef } from 'react';
import { FormGroup, InputGroup } from '@blueprintjs/core';
import PropTypes from 'prop-types';

const Label = ({ name, required }) => (
  <>
    <span>{name}</span>
    {required && <span>*</span>}
  </>
);

const Input = ({ name, id, t, ...props }) => {
  const { required } = props;
  return (
    <FormGroup
      label={<Label name={t(`jsonSchema.geometryField.${name}`)} required={required} />}
      labelFor={id}
    >
      <InputGroup
        id={id}
        inputMode="numeric"
        pattern="[+-]?([0-9]*[.])?[0-9]+"
        type="text"
        {...props}
      />
    </FormGroup>
  );
};

const PointField = ({
  idSchema: { coordinates: { $id } },
  formData: { coordinates, type },
  onChange,
  t,
  schema: {
    required = [],
  },
  disabled,
}) => {
  const isRequired = required.includes('coordinates');

  const refLatitude = useRef(null);
  const refLongitude = useRef(null);

  const handleChange = useCallback(() => {
    const nextCoordinates = [
      Number(refLatitude.current.value),
      Number(refLongitude.current.value),
    ];
    onChange({ type, coordinates: nextCoordinates });
  }, [onChange, type]);

  useEffect(() => {
    const [latitude = '', longitude = ''] = coordinates;
    refLatitude.current.value = latitude;
    refLongitude.current.value = longitude;
    refLatitude.current.focus();
  }, [coordinates]);

  return (
    <div>
      {['latitude', 'longitude'].map((name, index) => {
        const ref = !index ? refLatitude : refLongitude;
        const { current } = ref;
        const { value = '' } = current || {};
        return (
          <Input
            key={name}
            defaultValue={value}
            disabled={disabled}
            id={`${$id}-${index}`}
            inputRef={ref}
            name={name}
            onFocus={handleChange}
            onChange={handleChange}
            required={isRequired}
            t={t}
          />
        );
      })}
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
