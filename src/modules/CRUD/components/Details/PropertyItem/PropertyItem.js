import React from 'react';
import PropTypes from 'prop-types';
import Type from './Type';

const PropertyItem = ({ value }) => (
  <li className="details__list-item">
    <strong className="details__list-label">{value.title}</strong>
    <span className="details__list-value">
      <Type {...value} />
    </span>
  </li>
);

PropertyItem.propTypes = {
  value: PropTypes.shape({
    title: PropTypes.string,
  }),
};

PropertyItem.defaultProps = {
  value: {
    title: '',
  },
};

export default PropertyItem;
