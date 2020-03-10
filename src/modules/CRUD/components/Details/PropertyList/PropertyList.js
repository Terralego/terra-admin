import React, { useState } from 'react';
import PropTypes from 'prop-types';
import PropertyItem from '../PropertyItem';

const PropertyList = ({ properties, ...props }) => {
  const [editedItem, setEditedItem] = useState('');
  return (
    <ul className="details__list">
      {Object.entries(properties).map(([key, value]) => (
        <PropertyItem
          key={key}
          name={key}
          value={value}
          editedItem={editedItem}
          setEditedItem={setEditedItem}
          {...props}
        />
      ))}
    </ul>
  );
};

PropertyList.propTypes = {
  properties: PropTypes.shape({}),
};

PropertyList.defaultProps = {
  properties: {},
};

export default PropertyList;
