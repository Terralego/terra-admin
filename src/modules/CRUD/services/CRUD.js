import Api from '@terralego/core/modules/Api';

export const fetchSettings = () => Api.request('crud/settings');

const flattenMenu = menu => (
  menu.reduce((list, { crud_views: views }) => (
    [...list, ...views]
  ), [])
);

export const getLayer = ({ menu = [] }, name) => {
  const layers = flattenMenu(menu);
  if (!layers || !name) {
    return false;
  }
  const {
    layer,
    name: displayName,
  } = flattenMenu(menu).find(item => item.layer.name === name) || {};

  return layer ? { ...layer, displayName } : false;
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
    { id, map_style: style = {}, layer: { name, group: source } },
  ) => (
    (!Object.keys(style).length)
      ? layersList
      : [
        ...layersList,
        {
          id: `terralego-${name}-${id}`,
          'source-layer': name,
          source,
          ...style,
        },
      ]
  ), []);

export default { fetchSettings, getLayer, getSources, getLayersPaints };
