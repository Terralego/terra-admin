import DEFAULT_MAP_STYLE from '../config/mapStyle';

/**
 * Traduit un fond de plan en style affichable par maplibre.
 *
 * @returns {{ style: (Object|string|null), unsupported: boolean }}
 *   `unsupported` signale un style Mapbox qu'il a fallu remplacer par le fond
 *   par défaut, pour que l'appelant puisse le dire à l'utilisateur.
 */
export const getBaseLayerStyle = ({
  base_layer_type: type,
  tiles = [],
  map_box_url: mapBoxUrl,
  tile_size: tileSize,
  min_zoom: minZoom,
  max_zoom: maxZoom,
  sprite,
  glyphs,
  attribution,
} = {}) => {
  if (type === 'mapbox') {
    if (!mapBoxUrl) {
      return { style: null, unsupported: false };
    }
    // maplibre ne sait pas résoudre les URLs `mapbox://` — elles supposent un
    // jeton et une API Mapbox. On retombe sur le fond de plan par défaut.
    if (mapBoxUrl.startsWith('mapbox://')) {
      return { style: DEFAULT_MAP_STYLE, unsupported: true };
    }
    return { style: mapBoxUrl, unsupported: false };
  }

  // Vector tiles carry geometry but no styling: the layer definitions live in
  // the front office, so there is nothing to draw here
  if (type !== 'raster') {
    return { style: null, unsupported: false };
  }

  const urls = (tiles || []).filter(Boolean);
  if (!urls.length) {
    return { style: null, unsupported: false };
  }

  return {
    unsupported: false,
    style:       {
      version: 8,
      ...(sprite ? { sprite } : {}),
      ...(glyphs ? { glyphs } : {}),
      sources: {
        'base-layer': {
          type:     'raster',
          tiles:    urls,
          tileSize: tileSize || 256,
          ...(Number.isFinite(minZoom) ? { minzoom: minZoom } : {}),
          ...(Number.isFinite(maxZoom) ? { maxzoom: maxZoom } : {}),
          ...(attribution ? { attribution } : {}),
        },
      },
      layers: [
        {
          id:     'base-layer',
          type:   'raster',
          source: 'base-layer',
        },
      ],
    },
  };
};

export default getBaseLayerStyle;
