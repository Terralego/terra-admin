import Api from '@terralego/core/modules/Api';
import { sanitizeCustomEndpoint } from './utils';

export const ACTION_CREATE = 'create';

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

export const getView = ({ menu = [] } = {}, value, layerField = 'layer.name') => {
  const view = flattenMenu(menu);
  if (!view.length || value === undefined) {
    return false;
  }
  const viewProps = view.find(item => {
    const propToFind = layerField.split('.').reduce((obj, prop) => obj?.[prop], item);
    return propToFind === value;
  }) || {};

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

export const getLayers = ({ menu = [] }) =>
  flattenMenu(menu).reduce((
    layersList,
    {
      layer: { id },
      map_layers: mapLayers,
    },
  ) => ([
    ...layersList,
    ...mapLayers.map(({ id_layer_vt: name, style, ...props }) => ({
      id: `CRUD-${name}-${id}`,
      'source-layer': name,
      source: `${id}`,
      ...style,
      ...props,
    })),
  ]), []);

export default { fetchSettings, getView, getSources, getLayers, getFirstCrudViewName };
