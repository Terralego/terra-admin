import React from 'react';
import PropTypes from 'prop-types';
import IconFromCoordinates from './IconFromCoordinates';
import NoValue from '../../NoValue';

const GeometryType = ({ value }) => {
  const { coordinates } = value;
  if (!coordinates.length) {
    return <NoValue />;
  }
  return (
    <IconFromCoordinates {...value} />
  );
};

GeometryType.propTypes = {
  value: PropTypes.shape({
    coordinates: PropTypes.array,
  }),
};

GeometryType.defaultProps = {
  value: {
    coordinates: [],
  },
};

export default GeometryType;
