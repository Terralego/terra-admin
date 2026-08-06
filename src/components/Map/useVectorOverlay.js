import React from 'react';

/**
 * Pose une source vectorielle et ses couches par-dessus le style d'une carte
 * déjà chargée.
 *
 * On superpose plutôt que de fusionner dans le style spec, parce que le fond de
 * plan est une URL : le fusionner supposerait de le télécharger et de le
 * recombiner, et surtout d'arbitrer entre son `sprite` et le nôtre. En
 * superposant, le fond garde ses glyphes et ses icônes, et les couches ajoutées
 * en profitent.
 *
 * Les couches ne sont ajoutées qu'une fois le TileJSON résolu : c'est lui qui
 * nomme les couches disponibles dans les tuiles (`vector_layers`), et le
 * `source-layer` est obligatoire dès l'ajout. On lit donc la valeur faisant
 * autorité au lieu de la deviner.
 *
 * @param {Object} mapRef        ref renvoyée par `useMaplibreMap`
 * @param {boolean} ready        la carte a émis `load`
 * @param {string} sourceId
 * @param {string} [tilesUrl]    URL du TileJSON ; rien n'est posé sans elle
 * @param {Function} getLayers   `(sourceLayer) => couches maplibre`. Doit être
 *   stable : un changement réinstalle la source et ses couches.
 * @param {boolean} [fitToBounds] cadre sur l'étendue annoncée par le TileJSON,
 *   sans quoi l'aperçu s'ouvre sur le monde entier et la donnée est invisible
 * @param {Function} [onError]   reçoit l'erreur maplibre (TileJSON injoignable…)
 */
export const useVectorOverlay = ({
  mapRef,
  ready,
  sourceId,
  tilesUrl,
  getLayers,
  fitToBounds = true,
  onError,
}) => {
  const onErrorRef = React.useRef(onError);
  onErrorRef.current = onError;

  React.useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready || !tilesUrl) {
      return undefined;
    }

    let added  = [];
    let fitted = false;

    const handleError = event => onErrorRef.current?.(event?.error || event);

    // maplibre recopie le TileJSON sur l'objet source : `vectorLayerIds` et
    // `bounds` n'existent donc qu'une fois la requête résolue, d'où l'attente
    // d'un `sourcedata`. On n'agit qu'une fois pour chacun.
    const handleSourceData = event => {
      if (event.sourceId !== sourceId) {
        return;
      }
      const source = map.getSource(sourceId);
      if (!source) {
        return;
      }

      if (!added.length && source.vectorLayerIds?.length) {
        const [sourceLayer] = source.vectorLayerIds;
        added = getLayers(sourceLayer);
        added.forEach(layer => map.addLayer(layer));
      }

      if (!fitted && fitToBounds && source.bounds?.length === 4) {
        fitted = true;
        map.fitBounds(source.bounds, { padding: 20, duration: 0 });
      }
    };

    map.on('error', handleError);
    map.on('sourcedata', handleSourceData);
    map.addSource(sourceId, { type: 'vector', url: tilesUrl });

    return () => {
      map.off('error', handleError);
      map.off('sourcedata', handleSourceData);
      // Au démontage la carte peut déjà avoir été détruite par
      // `useMaplibreMap` : `getLayer` lève alors, d'où la garde.
      try {
        added.forEach(({ id }) => {
          if (map.getLayer(id)) {
            map.removeLayer(id);
          }
        });
        if (map.getSource(sourceId)) {
          map.removeSource(sourceId);
        }
      } catch (e) {
        // carte déjà détruite : il n'y a plus rien à nettoyer
      }
    };
  }, [mapRef, ready, sourceId, tilesUrl, getLayers, fitToBounds]);
};

export default useVectorOverlay;
