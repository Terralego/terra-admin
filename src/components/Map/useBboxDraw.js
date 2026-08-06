import React from 'react';

/* eslint-disable import/no-extraneous-dependencies */
import { TerraDraw, TerraDrawRectangleMode } from 'terra-draw';
import { TerraDrawMapLibreGLAdapter } from 'terra-draw-maplibre-gl-adapter';
/* eslint-enable import/no-extraneous-dependencies */

import getBbox from '@turf/bbox';
import getBboxPolygon from '@turf/bbox-polygon';

const RECTANGLE_MODE = 'rectangle';

/**
 * Dessin d'une emprise rectangulaire sur une carte maplibre.
 *
 * Un seul rectangle vit à la fois : dessiner en remplace un existant. Les
 * emprises circulent ici sous forme de bbox à plat `[ouest, sud, est, nord]`,
 * charge aux appelants de convertir vers le format qu'ils stockent.
 *
 * @param {Function} onChange appelé avec la bbox à plat, ou `null` si effacée
 * @returns {{ attach: Function, setBbox: Function, clear: Function }}
 */
export const useBboxDraw = ({ onChange }) => {
  const drawRef = React.useRef(null);

  const onChangeRef = React.useRef(onChange);
  onChangeRef.current = onChange;

  // Démarre le dessin sur une carte dont le style est chargé — avant, terra-draw
  // n'a pas de style où poser ses sources et ses couches.
  const attach = React.useCallback(map => {
    const draw = new TerraDraw({
      adapter: new TerraDrawMapLibreGLAdapter({ map }),
      modes:   [new TerraDrawRectangleMode()],
    });

    draw.on('finish', id => {
      // Ne garder que le dernier rectangle dessiné
      const stale = draw.getSnapshot()
        .filter(feature => feature.id !== id)
        .map(feature => feature.id);
      if (stale.length) {
        draw.removeFeatures(stale);
      }

      const feature = draw.getSnapshotFeature(id);
      if (feature) {
        onChangeRef.current(getBbox(feature));
      }
    });

    draw.start();
    draw.setMode(RECTANGLE_MODE);
    drawRef.current = draw;
  }, []);

  const setBbox = React.useCallback(bbox => {
    const draw = drawRef.current;
    if (!draw) {
      return;
    }
    draw.clear();
    if (bbox) {
      draw.addFeatures([{
        ...getBboxPolygon(bbox),
        properties: { mode: RECTANGLE_MODE },
      }]);
    }
    // `clear` sort du mode de dessin : y revenir permet de redessiner aussitôt
    draw.setMode(RECTANGLE_MODE);
  }, []);

  const clear = React.useCallback(() => {
    setBbox(null);
    onChangeRef.current(null);
  }, [setBbox]);

  React.useEffect(() => () => {
    drawRef.current?.stop();
    drawRef.current = null;
  }, []);

  return { attach, setBbox, clear };
};

export default useBboxDraw;
