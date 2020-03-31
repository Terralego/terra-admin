import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';


const Field = props => {
  const {
    formData,
    onChange,
    registry: { fields: { SchemaField } },
  } = props;

  const [data, setData] = useState(formData);

  const handleBlur = useCallback(() => {
    onChange(data);
  }, [data, onChange]);

  return (
    <SchemaField
      {...props}
      formData={data}
      onChange={setData}
      onBlur={handleBlur}
    />
  );
};

Field.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  formData: PropTypes.any,
  onChange: PropTypes.func,
  registry: PropTypes.shape({
    fields: PropTypes.shape({
      SchemaField: PropTypes.func,
    }),
  }),
};

Field.defaultProps = {
  formData: undefined,
  onChange: () => {},
  registry: {
    fields: {
      SchemaField: () => {},
    },
  },
};

export default Field;
