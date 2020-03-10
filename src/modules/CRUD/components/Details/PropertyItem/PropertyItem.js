import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Type from './Type';
import Edit from './Edit';


const PropertyItem = ({
  canUpdateFeature,
  canViewFeature,
  value,
  ...props
}) => {
  if (!canViewFeature) {
    return null;
  }
  const { editedItem, name } = props;
  const isCurrentEditedItem = editedItem === name;
  return (
    <li className={classnames({
      'details__list-item': true,
      'details__list-item--active': isCurrentEditedItem,
      'details__list-item--inactive': !isCurrentEditedItem && editedItem !== '',
    })}
    >
      <span className="details__list-label">{value.title}</span>
      <div className="details__list-value">
        <Type {...value} />
      </div>
      {canUpdateFeature && <Edit {...value} {...props} />}
    </li>
  );
};

PropertyItem.propTypes = {
  canUpdateFeature: PropTypes.bool,
  canViewFeature: PropTypes.bool,
  editedItem: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.shape({
    title: PropTypes.string,
  }),
};

PropertyItem.defaultProps = {
  canUpdateFeature: false,
  canViewFeature: false,
  editedItem: '',
  name: undefined,
  value: {
    title: '',
  },
};

export default PropertyItem;
