import Api from '@terralego/core/modules/Api';

export const fetchSettings = () => Api.request('crud/settings');

export const getLayerFromCRUD = ({ menu = [] }, name) => {
  const [view = {}] = menu.map(({ crud_views: views }) =>
    views.find(item => item.layer.name === name)).filter(Boolean);

  return view.layer ? { ...view.layer, displayName: view.name } : false;
};

export const getSourcesFromCRUD = ({ menu = [] }) =>
  menu.reduce((list, { crud_views: views }) => (
    [
      ...list,
      ...views.reduce((sourceList, { layer }) => (
        (sourceList.some(({ id }) => id === layer.group))
          ? sourceList
          : [
            ...sourceList,
            { id: layer.group, type: 'vector', url: layer.group_tilejson },
          ]
      ), []),
    ]
  ), []);

export const getLayersPaintsFromCRUD = ({ menu = [] }) =>
  menu.reduce((list, { crud_views: views }) => (
    [
      ...list,
      ...views.reduce((layersList, { map_style: style, layer: { name, group: source } }) => (
        (!Object.keys(style).length)
          ? layersList
          : [
            ...layersList,
            {
              id: `terralego-${name}`,
              'source-layer': name,
              source,
              ...style,
            },
          ]
      ), []),
    ]
  ), []);

export default { fetchSettings, getLayerFromCRUD, getSourcesFromCRUD, getLayersPaintsFromCRUD };
