import React, { memo, useContext } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import Message from '../../Message';
import ResetGeometry from './ResetGeometry';
import { GeometryFieldContext } from './GeometryFieldProvider';

const getIconFromType = type => {
  if (type.includes('Point')) {
    return 'point';
  }
  if (type.includes('Line')) {
    return 'line';
  }
  return 'polygon';
};

const Information = ({
  schema: { default: {
    coordinates: schemaCoordinates,
    type: schemaType,
  } },
}) => {
  const {
    isRequired,
    isRouting,
    nextFormData: { geom } = {},
  } = useContext(GeometryFieldContext);


  const { t } = useTranslation();

  const { coordinates = schemaCoordinates, type = schemaType } = geom || {};

  const hasDraw = Boolean(coordinates.length);
  const action = !hasDraw ? 'create' : 'edit';

  return (
    <>
      <p className="control-label">
        <span>{t(`jsonSchema.geometryField.information-${action}`, { type })}
          {isRequired && <span className="required">*</span>}
        </span>
        <span><ResetGeometry disabled={!hasDraw} intent={hasDraw ? 'danger' : ''} /></span>
      </p>
      <Message className="geometry-field__message" intent="primary">
        {isRouting
          ? t('jsonSchema.geometryField.helper-routing')
          : (
            <Trans i18nKey="jsonSchema.geometryField.helper">
              Enter coordinates by using the tool <span className={`mapbox-gl-draw_ctrl-draw-btn mapbox-gl-draw_${getIconFromType(type)}`} /> on map
            </Trans>
          )}
      </Message>
    </>
  );
};

Information.propTypes = {
  schema: PropTypes.shape({
    default: PropTypes.shape({
      coordinates: PropTypes.array,
      type: PropTypes.string,
    }),
  }),
};

Information.defaultProps = {
  schema: {
    default: {
      coordinates: [],
      type: undefined,
    },
  },
};

export default memo(Information);
