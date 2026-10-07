import Api from '../../../../terra-front/Api';

export const fetchViewList = async () => Api.request('geolayer/scene/');

export default { fetchViewList };
