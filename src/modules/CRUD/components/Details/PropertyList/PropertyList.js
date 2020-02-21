import React from 'react';
import PropTypes from 'prop-types';
import PropertyItem from '../PropertyItem';

const PropertyList = ({ properties }) => (
  <ul className="details__list">
    {Object.entries(properties).map(([key, value]) => (
      <PropertyItem
        key={key}
        name={key}
        value={value}
      />
    ))}
  </ul>
);

PropertyList.propTypes = {
  properties: PropTypes.shape({}),
};

PropertyList.defaultProps = {
  properties: {},
};

export default PropertyList;
