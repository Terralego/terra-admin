import Api from '@terralego/core/modules/Api';
import {
  POINT,
  LINESTRING,
  POLYGON,
  MULTI_POINT,
  MULTI_LINESTRING,
  MULTI_POLYGON,
} from '../../../utils/geom';
import { sanitizeCustomEndpoint } from './utils';

export const ACTION_CREATE = 'create';
export const ACTION_UPDATE = 'update';

const snakeToCamel = str => str.replace(
  /([-_][a-z])/g,
  group => group.toUpperCase().substring(1),
);

const camelCaseKeys = obj => Object.keys(obj).reduce((props, key) => ({
  ...props,
  [snakeToCamel(key)]: obj[key],
}), {});


export const fetchSettings = endpoint =>
  Api.request(`${sanitizeCustomEndpoint(endpoint)}/`);


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

export const getView = ({ menu = [] }, name) => {
  const view = flattenMenu(menu);
  if (!view.length || !name) {
    return false;
  }
  const viewProps = view.find(({ layer }) => layer.name === name) || {};

  return viewProps.layer
    ? camelCaseKeys(viewProps)
    : false;
};

export const getFirstCrudViewName = (settings = {}) => {
  const { menu: [{ crud_views: [{ layer: { name } = {} } = {}] = [] } = {}] = [] } = settings;
  return name;
};

export const getSources = ({ menu = [] }) =>
  flattenMenu(menu).reduce((sourceList, { layer }) => (
    (sourceList.some(({ id }) => id === `${layer.id}`))
      ? sourceList
      : [
        ...sourceList,
        { id: `${layer.id}`, type: 'vector', url: layer.tilejson },
      ]
  ), []);

export const getLayersPaints = ({ menu = [] }) =>
  flattenMenu(menu).reduce((
    layersList,
    {
      layer: { name, id, geom_type: geomType },
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
          source: `${id}`,
          ...style,
        },
      ];
  }, []);

export default { fetchSettings, getView, getSources, getLayersPaints, getFirstCrudViewName };
