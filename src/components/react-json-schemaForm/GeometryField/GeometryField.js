import React from 'react';
import PropTypes from 'prop-types';
import Message from '../../Message';
import PointField from './PointField';

const Fieldset = ({ t, children }) => (
  <fieldset>
    <legend>{t('jsonSchema.geometryField.title')}</legend>
    <div className="form-group field">
      {children}
    </div>
  </fieldset>
);

const GeometryField = props => {
  const { formData: { coordinates, type }, t } = props;
  if (type === 'Point') {
    return (
      <Fieldset t={t}>
        <PointField {...props} />
      </Fieldset>
    );
  }
  const action = !coordinates.length ? 'create' : 'edit';
  return (
    <Fieldset t={t}>
      <Message intent="primary">
        <p>{t(`jsonSchema.geometryField.helper-${action}`, { type })}</p>
        <div>{t('jsonSchema.geometryField.save')}</div>
      </Message>
    </Fieldset>
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
