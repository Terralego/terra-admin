import Api from '@terralego/core/modules/Api';

export const fetchViewList = async () => Api.request('geolayer/scene/');

export default { fetchViewList };
