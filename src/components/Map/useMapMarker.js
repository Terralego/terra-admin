import React from 'react';

// eslint-disable-next-line import/no-extraneous-dependencies
import maplibregl from 'maplibre-gl';

/**
 * Maintient un unique marqueur sur une carte maplibre.
 *
 * Le marqueur est créé au premier jeu de coordonnées puis simplement déplacé :
 * il n'est retiré que lorsque les coordonnées disparaissent, ou au démontage.
 *
 * @param {Object} mapRef      ref renvoyée par `useMaplibreMap`
 * @param {Array} [coordinates] [lon, lat]
 * @param {string} [className]  classe appliquée à l'élément du marqueur
 */
// Les champs de saisie rendent la coordonnée vide sous forme de chaîne — que
// `Number('')` transformerait en 0, soit un marqueur au large du Ghana.
const isCoordinate = value => value !== '' && value !== null && value !== undefined
  && Number.isFinite(Number(value));

export const useMapMarker = ({ mapRef, coordinates, className }) => {
  const markerRef = React.useRef(null);

  React.useEffect(() => {
    const map = mapRef.current;
    const [lon, lat] = coordinates || [];

    if (!map || !isCoordinate(lon) || !isCoordinate(lat)) {
      markerRef.current?.remove();
      markerRef.current = null;
      return;
    }

    if (markerRef.current) {
      markerRef.current.setLngLat([lon, lat]);
      return;
    }

    const element = document.createElement('span');
    element.className = className;
    markerRef.current = new maplibregl.Marker({ element, anchor: 'center' })
      .setLngLat([lon, lat])
      .addTo(map);
  }, [mapRef, coordinates, className]);

  React.useEffect(() => () => {
    markerRef.current?.remove();
    markerRef.current = null;
  }, []);
};

export default useMapMarker;
