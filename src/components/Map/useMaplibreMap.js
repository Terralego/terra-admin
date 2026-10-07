import React from 'react';

import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import DEFAULT_MAP_STYLE from '../../config/mapStyle';

/**
 * Crée et pilote une carte maplibre de façon impérative.
 *
 * Point de contact unique avec maplibre : tous les composants carte de l'admin
 * passent par ce hook, de sorte qu'un changement de moteur ne touche qu'ici.
 *
 * La carte est créée une seule fois — `style`, `center` et `zoom` ne servent
 * qu'à l'initialisation, puis un changement de `style` est poussé via
 * `setStyle` pour ne jamais remonter le canvas.
 *
 * @param {Object|string} [style]  style spec ou URL de style
 * @param {Array}  [center]        [lon, lat]
 * @param {number} [zoom]
 * @param {boolean} [navigation]   ajoute le contrôle de navigation
 * @param {Function} [onReady]     appelé avec la carte une fois le style chargé
 * @param {Function} [onClick]     appelé avec l'événement de clic maplibre
 * @param {Function} [transformRequest] `(url, resourceType) => ({ url, headers })`,
 *   seul moyen d'authentifier les requêtes : maplibre va chercher tuiles et
 *   TileJSON lui-même et ne passe donc pas par `Api`, qui pose le jeton JWT.
 * @returns {{ containerRef: Object, mapRef: Object }}
 */
export const useMaplibreMap = ({
  style = DEFAULT_MAP_STYLE,
  center,
  zoom,
  navigation = true,
  onReady,
  onClick,
  transformRequest,
} = {}) => {
  const containerRef = React.useRef(null);
  const mapRef       = React.useRef(null);

  const initial  = React.useRef({ style, center, zoom });
  const onReadyRef = React.useRef(onReady);
  onReadyRef.current = onReady;
  const onClickRef = React.useRef(onClick);
  onClickRef.current = onClick;
  const transformRequestRef = React.useRef(transformRequest);
  transformRequestRef.current = transformRequest;

  React.useEffect(() => {
    if (!containerRef.current || !initial.current.style) {
      return undefined;
    }

    const map = new maplibregl.Map({
      container:          containerRef.current,
      style:              initial.current.style,
      center:             initial.current.center,
      zoom:               initial.current.zoom,
      attributionControl: true,
      // Passe par une ref : maplibre ne lit cette option qu'à la création, et
      // on ne veut pas remonter la carte parce que le jeton a changé.
      transformRequest:   (url, resourceType) =>
        transformRequestRef.current?.(url, resourceType),
    });
    mapRef.current = map;

    if (navigation) {
      map.addControl(new maplibregl.NavigationControl(), 'top-right');
    }

    const handleLoad  = () => onReadyRef.current?.(map);
    const handleClick = event => onClickRef.current?.(event);
    map.once('load', handleLoad);
    map.on('click', handleClick);

    return () => {
      map.off('load', handleLoad);
      map.off('click', handleClick);
      map.remove();
      mapRef.current = null;
    };
  }, [navigation]);

  React.useEffect(() => {
    if (mapRef.current && style) {
      mapRef.current.setStyle(style);
    }
  }, [style]);

  // Le conteneur est dimensionné par son parent flex : il change de taille sans
  // que la fenêtre bouge — or c'est la seule chose que maplibre surveille.
  React.useEffect(() => {
    if (!containerRef.current || typeof ResizeObserver === 'undefined') {
      return undefined;
    }
    const observer = new ResizeObserver(() => mapRef.current?.resize());
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return { containerRef, mapRef };
};

export default useMaplibreMap;
