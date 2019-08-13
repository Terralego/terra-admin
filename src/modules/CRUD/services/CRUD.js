import Api from '@terralego/core/modules/Api';

export const fetchSettings = () => Api.request('crud/settings');

export function getLayerFromCRUD ({ menu = [] }, name) {
  const [view = {}] = menu.map(({ crud_views: views }) =>
    views.find(item => item.layer.name === name)).filter(Boolean);

  return view.layer ? { ...view.layer, displayName: view.name } : false;
}

export default { fetchSettings, getLayerFromCRUD };
