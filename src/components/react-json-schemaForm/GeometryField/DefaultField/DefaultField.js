import { useEffect } from 'react';
import PropTypes from 'prop-types';

const DefaultField = ({
  formData,
  onChange,
}) => {
  useEffect(() => {
    onChange(formData);
  }, [formData, onChange]);

  return null;
};

DefaultField.propTypes = {
  formData: PropTypes.shape({}),
  onChange: PropTypes.func,
};

DefaultField.defaultProps = {
  formData: {
    coordinates: [],
  },
  onChange: () => {},
};

export default DefaultField;
