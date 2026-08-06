import React from 'react';

import useMaplibreMap from './useMaplibreMap';

/**
 * Carte maplibre en lecture seule dont le style peut changer dans le temps.
 *
 * Le style est reconstruit à chaque frappe du formulaire qu'elle prévisualise :
 * `useMaplibreMap` le pousse via `setStyle` plutôt que de remonter le canvas.
 *
 * @param {Object|string} style style spec ou URL de style
 * @param {Array}  [center] [lon, lat]
 * @param {number} [zoom]
 * @param {string} [className]
 */
export const MapPreview = ({ style, center, zoom, className }) => {
  const { containerRef } = useMaplibreMap({ style, center, zoom });

  return <div ref={containerRef} className={className} />;
};

export default MapPreview;
