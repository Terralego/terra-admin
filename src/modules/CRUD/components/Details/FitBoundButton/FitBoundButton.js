import React, { useCallback, useContext } from 'react';
import PropTypes from 'prop-types';
import { Button, Tooltip } from '@blueprintjs/core';
import { MapContext } from '../../../services/MapProvider';

import { getBounds } from '../../../services/features';

const FitBoundButton = ({ coordinates, t, title }) => {
  const { detailsRef, map } = useContext(MapContext);

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
  title: PropTypes.string,
  t: PropTypes.func,
};

FitBoundButton.defaultProps = {
  coordinates: [],
  title: undefined,
  t: () => {},
};

export default FitBoundButton;
