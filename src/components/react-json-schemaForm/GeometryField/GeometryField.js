import React from 'react';
import PropTypes from 'prop-types';
import PointField from './PointField';

const GeometryField = props => {
  const { formData: { type }, t } = props;
  if (type === 'Point') {
    return (
      <PointField {...props} />
    );
  }
  return (
    <div>
      {type && <p>{t('jsonSchema.geometryField.title')} <em>{type}</em>.</p>}
      <p>{t('jsonSchema.geometryField.helper-edit')}</p>
      <p>{t('jsonSchema.geometryField.helper-save')}</p>
    </div>
  );
};

GeometryField.propTypes = {
  formData: PropTypes.shape({
    type: PropTypes.string,
  }),
  t: PropTypes.func,
};

GeometryField.defaultProps = {
  formData: {
    type: '',
  },
  t: text => text,
};

export default GeometryField;
