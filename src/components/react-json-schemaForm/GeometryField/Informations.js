import React, { memo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import Message from '../../Message';

const getIconFromType = type => {
  if (type.includes('Point')) {
    return 'point';
  }
  if (type.includes('Line')) {
    return 'line';
  }
  return 'polygon';
};

const Information = props => {
  const {
    formData: { geom } = {},
    isRouting,
    schema: { default: {
      coordinates: schemaCoordinates,
      type: schemaType,
    } },
  } = props;

  const { t } = useTranslation();

  const { coordinates = schemaCoordinates, type = schemaType } = geom || {};

  const action = !coordinates.length ? 'create' : 'edit';

  return (
    <>
      <p className="control-label">{t(`jsonSchema.geometryField.information-${action}`, { type })}</p>
      <Message intent="primary">
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
  formData: PropTypes.shape({}),
  schema: PropTypes.shape({
    default: PropTypes.shape({
      coordinates: PropTypes.array,
      type: PropTypes.string,
    }),
  }),
};

Information.defaultProps = {
  formData: {
    coordinates: [],
  },
  schema: {
    default: {
      coordinates: [],
      type: undefined,
    },
  },
};

export default memo(Information);
