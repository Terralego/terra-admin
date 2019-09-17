import Api from '@terralego/core/modules/Api';
import {
  POINT,
  LINESTRING,
  POLYGON,
  MULTI_POINT,
  MULTI_LINESTRING,
  MULTI_POLYGON,
} from '../../../utils/geom';

export const ACTION_CREATE = 'create';
export const ACTION_UPDATE = 'update';

export const fetchSettings = () =>
  Api.request('crud/settings/');


const flattenMenu = menu => (
  menu.reduce((list, { crud_views: views }) => (
    [...list, ...views]
  ), [])
);

const getDefaultPaintsByGeomType = geomType => {
  switch (geomType) {
    case LINESTRING:
    case MULTI_LINESTRING:
      return { type: 'line', paint: { 'line-color': '#000', 'line-width': 3 } };
    case POINT:
    case MULTI_POINT:
      return { type: 'circle', paint: { 'circle-color': '#000', 'circle-radius': 8 } };
    case POLYGON:
    case MULTI_POLYGON:
      return { type: 'fill', paint: { 'fill-color': '#000' } };
    default:
      return {};
  }
};

export const getLayer = ({ menu = [] }, name) => {
  const layers = flattenMenu(menu);
  if (!layers.length || !name) {
    return false;
  }
  const {
    layer,
    name: displayName,
    form_schema: schema,
    ui_schema: uiSchema,
  } = flattenMenu(menu).find(item => item.layer.name === name) || {};

  return layer ? { ...layer, displayName, schema, uiSchema } : false;
};

export const getSources = ({ menu = [] }) =>
  flattenMenu(menu).reduce((sourceList, { layer }) => (
    (sourceList.some(({ id }) => id === layer.group))
      ? sourceList
      : [
        ...sourceList,
        { id: layer.group, type: 'vector', url: layer.group_tilejson },
      ]
  ), []);

export const getLayersPaints = ({ menu = [] }) =>
  flattenMenu(menu).reduce((
    layersList,
    {
      id,
      layer: { name, group: source, geom_type: geomType },
      map_style: mapStyle = {},
    },
  ) => {
    const style = (Object.keys(mapStyle).length) ? mapStyle : getDefaultPaintsByGeomType(geomType);
    return (!Object.keys(style).length)
      ? layersList
      : [
        ...layersList,
        {
          id: `terralego-${name}-${id}`,
          'source-layer': name,
          source,
          ...style,
        },
      ];
  }, []);

export default { fetchSettings, getLayer, getSources, getLayersPaints };
