import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Message from '../../../Message';

const DefaultField = props => {
  const {
    formData,
    formData: { geom } = {},
    onChange,
    schema: { default: {
      coordinates: schemaCoordinates,
      type: schemaType,
    } },
    t,
  } = props;

  const { coordinates = schemaCoordinates, type = schemaType } = geom || {};

  useEffect(() => {
    onChange(formData);
  }, [formData, onChange]);

  const action = !coordinates.length ? 'create' : 'edit';

  return (
    <Message intent="primary">
      <p>{t(`jsonSchema.geometryField.helper-${action}`, { type })}</p>
      <div>{t('jsonSchema.geometryField.save')}</div>
    </Message>
  );
};

DefaultField.propTypes = {
  idSchema: PropTypes.shape({
    coordinates: PropTypes.shape({
      $ids: PropTypes.string,
    }),
  }),
  formData: PropTypes.shape({}),
  onChange: PropTypes.func,
  t: PropTypes.func,
};

DefaultField.defaultProps = {
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

export default DefaultField;
