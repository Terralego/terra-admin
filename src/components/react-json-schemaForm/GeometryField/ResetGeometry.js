import React from 'react';
import PropTypes from 'prop-types';
import { Button, Classes, H5, Popover, PopoverInteractionKind } from '@blueprintjs/core';
import { useTranslation } from 'react-i18next';
import { useGeometryField } from './GeometryFieldProvider';

const ResetGeometry = ({
  schema: {
    default: {
      coordinates: schemaCoordinates,
    },
  },
  ...props
}) => {
  const {
    resetFeatureCollection,
    nextFormData: {
      geom,
    } = {},
  } = useGeometryField();
  const { t } = useTranslation();

  const {
    coordinates = schemaCoordinates,
    type,
  } = geom || {};

  const onReset = () => {
    resetFeatureCollection();
  };

  if (!coordinates?.length) {
    return null;
  }

  return (
    <Popover
      className="geometry-field__reset"
      popoverClassName={Classes.POPOVER_CONTENT_SIZING}
      interactionKind={PopoverInteractionKind.CLICK}
      content={(
        <div className="details__confirm">
          <H5>{t('jsonSchema.geometryField.reset.confirmation', { type })}</H5>
          <div className="details__confirm-content">
            <Button
              className={Classes.POPOVER_DISMISS}
              text={t('common.cancel')}
            />
            <Button
              className={Classes.POPOVER_DISMISS}
              intent="danger"
              onClick={onReset}
              text={t('form.reset')}
            />
          </div>
        </div>
      )}
    >
      <Button
        intent="danger"
        minimal
        {...props}
      >
        {t('jsonSchema.geometryField.reset.label', { type })}
      </Button>
    </Popover>
  );
};

ResetGeometry.propTypes = {
  schema: PropTypes.shape({
    default: PropTypes.shape({
      coordinates: PropTypes.array,
    }),
  }),
};

ResetGeometry.defaultProps = {
  schema: {
    default: {
      coordinates: [],
    },
  },
};

export default ResetGeometry;
