import React from 'react';

/* eslint-disable import/no-extraneous-dependencies */
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import HomeIcon from '@material-ui/icons/Home';
import { makeStyles } from '@material-ui/core/styles';
/* eslint-enable */

import useAppSettings from '../../hooks/useAppSettings';
import useMaplibreMap from './useMaplibreMap';
import useBboxDraw from './useBboxDraw';

const useStyles = makeStyles({
  root: {
    position: 'relative',
    height:   300,
    width:    '100%',
    maxWidth: 600,
  },
  map: {
    height: '100%',
    width:  '100%',
  },
  control: {
    position:        'absolute',
    left:            10,
    backgroundColor: 'white',
  },
  clear: {
    top: 10,
  },
  reset: {
    top: 50,
  },
});

/**
 * Carte d'édition d'une emprise rectangulaire, partagée par les vues qui en
 * stockent une (emprise d'une vue, emprise d'un widget).
 *
 * Les bbox échangées sont à plat — `[ouest, sud, est, nord]`, le format turf —
 * quel que soit ce que l'appelant persiste de son côté.
 *
 * @param {string}   label
 * @param {Array}    [value]        bbox à plat courante
 * @param {Function} onChange       reçoit la nouvelle bbox à plat, ou `null`
 * @param {Array}    [fallbackBbox] emprise appliquée (et remontée) faute de `value`
 */
export const BboxMapInput = ({ label, value, onChange, fallbackBbox }) => {
  const classes = useStyles();
  const { map: mapConfig } = useAppSettings() || {};

  const { attach, setBbox, clear } = useBboxDraw({ onChange });

  // La carte n'est montée qu'une fois : ce qu'il faut y semer est lu au moment
  // du `load`, pas capturé dans les dépendances du hook.
  const initialRef = React.useRef(null);
  initialRef.current = { value, fallbackBbox, onChange };

  const handleReady = React.useCallback(map => {
    attach(map);

    const { value: bbox, fallbackBbox: fallback, onChange: emit } = initialRef.current;
    const initialBbox = (bbox && bbox.length) ? bbox : fallback;
    if (!initialBbox) {
      return;
    }

    map.fitBounds(initialBbox, { padding: 20 });
    setBbox(initialBbox);
    if (!bbox || !bbox.length) {
      emit(initialBbox);
    }
  }, [attach, setBbox]);

  const { containerRef, mapRef } = useMaplibreMap({
    center:  mapConfig?.center,
    zoom:    mapConfig?.zoom,
    onReady: handleReady,
  });

  const resetExtent = React.useCallback(() => {
    const map = mapRef.current;
    if (!map || !mapConfig) {
      return;
    }
    map.setCenter(mapConfig.center);
    map.setZoom(mapConfig.zoom);
  }, [mapRef, mapConfig]);

  return (
    <>
      <Typography variant="body1">{label}</Typography>
      <div className={classes.root}>
        <div ref={containerRef} className={classes.map} />
        <IconButton
          className={`${classes.control} ${classes.clear} maplibregl-ctrl-group`}
          size="small"
          onClick={clear}
        >
          <DeleteIcon />
        </IconButton>
        <IconButton
          className={`${classes.control} ${classes.reset} maplibregl-ctrl-group`}
          size="small"
          onClick={resetExtent}
        >
          <HomeIcon />
        </IconButton>
      </div>
    </>
  );
};

export default BboxMapInput;
