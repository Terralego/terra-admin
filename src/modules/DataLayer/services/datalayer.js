import Api from '@terralego/core/modules/Api';

let viewList = null;

export const fetchViewList = async () => {
  if (viewList === null) {
    const apiViews =  await Api.request('geolayer/view/');

    // Object tranformation from backend format
    // To frontend one.
    // Should be removed in a future release
    viewList = Object.entries(apiViews)
      .map(elt => {
        const [key, { pk, ...rest }] = elt;
        return { ...rest, id: pk, key };
      })
      .sort(({ id: idA }, { id: idB }) => idA - idB);
  }

  return viewList;
};
export default { fetchViewList };
