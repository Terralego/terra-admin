import React, { useState, useContext, useEffect, useMemo } from 'react';
import { useParams } from 'react-router';
import PropTypes from 'prop-types';
import PropertyItem from '../PropertyItem';
import { CRUDContext } from '../../../services/CRUDProvider';
import { toast } from '../../../../../utils/toast';

const PropertyList = ({ properties, ...props }) => {
  const { id } = useParams();
  const {
    errors: {
      feature,
    },
  } = useContext(CRUDContext);
  const featureError = useMemo(() => (
    feature.find(({ featureId }) => featureId === id)
  ), [feature, id]);
  const [editedItem, setEditedItem] = useState('');

  useEffect(() => {
    if (featureError?.error.data) {
      toast.displayError(
        <>
          <h3>{featureError.error.message}</h3>
          <p>{Object.values(featureError.error.data).join(', ')}</p>
        </>,
      );
    }
  }, [featureError]);

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
