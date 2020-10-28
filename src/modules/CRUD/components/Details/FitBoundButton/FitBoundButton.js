import React, { useCallback, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Button, Tooltip } from '@blueprintjs/core';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { MapContext } from '../../../services/MapProvider';
import { CRUDContext } from '../../../services/CRUDProvider';


const FitBoundButton = ({ title }) => {
  const { setFitBounds } = useContext(MapContext);
  const { feature } = useContext(CRUDContext);

  const { id } = useParams();
  const { t } = useTranslation();

  const coordinates = useMemo(() => {
    const { geom } = feature[id] || {};
    return geom.coordinates || {};
  }, [feature, id]);

  const handleClick = useCallback(() => {
    setFitBounds({
      coordinates,
      hasDetails: true,
    });
  }, [coordinates, setFitBounds]);

  if (!coordinates.length) {
    return null;
  }

  return (
    <Tooltip
      content={t('CRUD.details.fitBoundButton', { name: title })}
    >
      <Button
        icon="locate"
        onClick={handleClick}
      />
    </Tooltip>
  );
};

FitBoundButton.propTypes = {
  title: PropTypes.string,
};

FitBoundButton.defaultProps = {
  title: undefined,
};

export default FitBoundButton;
