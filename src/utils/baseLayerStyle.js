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
    return mapBoxUrl || null;
  }

  // Vector tiles carry geometry but no styling: the layer definitions live in
  // the front office, so there is nothing to draw here
  if (type !== 'raster') {
    return null;
  }

  const urls = (tiles || []).filter(Boolean);
  if (!urls.length) {
    return null;
  }

  return {
    version: 8,
    ...(sprite ? { sprite } : {}),
    ...(glyphs ? { glyphs } : {}),
    sources: {
      'base-layer': {
        type: 'raster',
        tiles: urls,
        tileSize: tileSize || 256,
        ...(Number.isFinite(minZoom) ? { minzoom: minZoom } : {}),
        ...(Number.isFinite(maxZoom) ? { maxzoom: maxZoom } : {}),
        ...(attribution ? { attribution } : {}),
      },
    },
    layers: [
      {
        id: 'base-layer',
        type: 'raster',
        source: 'base-layer',
      },
    ],
  };
};

export default getBaseLayerStyle;
