import React, { useCallback, useMemo } from 'react';
import { useTranslate } from 'react-admin';
import { useField } from 'react-final-form';

import BboxMapInput from '../../../../../../components/Map/BboxMapInput';
import useAppSettings from '../../../../../../hooks/useAppSettings';

/**
 * Emprise d'un widget, stockée en paire nord-ouest / sud-est
 * `[[ouest, nord], [est, sud]]` — d'où les conversions depuis et vers la bbox
 * à plat manipulée par `BboxMapInput`.
 */
const toFlatBbox = corners => {
  if (!corners || corners.length !== 2) {
    return null;
  }
  const [[west, north], [east, south]] = corners;
  return [west, south, east, north];
};

const toCorners = bbox => {
  const [west, south, east, north] = bbox;
  return [[west, north], [east, south]];
};

const MapBoundingBoxInput = ({ field }) => {
  const { input: { value: boundingBox, onChange } } = useField(field);
  const translate = useTranslate();
  const { map: mapConfig } = useAppSettings() || {};

  // Emprise par défaut issue des réglages : `minLat` a longtemps été lu
  // `MinLat`, les deux graphies sont donc acceptées.
  const fallbackBbox = useMemo(() => {
    const { minLon, maxLon, maxLat, minLat, MinLat } = mapConfig?.bounds || {};
    const south = minLat ?? MinLat;
    return [minLon, south, maxLon, maxLat].every(Number.isFinite)
      ? [minLon, south, maxLon, maxLat]
      : null;
  }, [mapConfig]);

  const handleChange = useCallback(
    bbox => onChange(bbox ? toCorners(bbox) : null),
    [onChange],
  );

  return (
    <div id="mapInput">
      <BboxMapInput
        label={translate('resources.datalayer.widgets-editor.bounding-box-editor-title')}
        value={toFlatBbox(boundingBox)}
        onChange={handleChange}
        fallbackBbox={fallbackBbox}
      />
    </div>
  );
};

export default MapBoundingBoxInput;
