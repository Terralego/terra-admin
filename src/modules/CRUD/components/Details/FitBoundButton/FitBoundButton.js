import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Button, Tooltip } from '@blueprintjs/core';

import { getBounds } from '../../../services/features';

const FitBoundButton = ({ coordinates, detailsRef, map, t, title }) => {
  const handleClick = useCallback(() => {
    const { current: detail } = detailsRef;
    if (!map || !detail) {
      return;
    }
    map
      .resize()
      .fitBounds(getBounds(coordinates), {
        padding: {
          top: 20,
          right: detail.offsetWidth + 50,
          bottom:  20,
          left: 20,
        },
        duration: 0,
      });
  }, [coordinates, detailsRef, map]);

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
  coordinates: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.number, PropTypes.array,
  ])),
  detailsRef: PropTypes.shape({}),
  map: PropTypes.shape({}),
  title: PropTypes.string,
  t: PropTypes.func,
};

FitBoundButton.defaultProps = {
  coordinates: [],
  detailsRef: null,
  map: undefined,
  title: undefined,
  t: () => {},
};

export default FitBoundButton;
