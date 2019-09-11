import Api from '@terralego/core/modules/Api';

let viewList = null;

export const fetchViewList = async () => {
  if (viewList === null) {
    const apiViews =  await Api.request('geolayer/view/');

    // Object transformation from backend format
    // to frontend one.
    // Should be removed in a future release
    viewList = Object.entries(apiViews)
      .map(([key, { pk: id, ...rest }]) => ({ ...rest, id, key }))
      .sort(({ id: idA }, { id: idB }) => idA - idB);
  }

  return viewList;
};
export default { fetchViewList };
