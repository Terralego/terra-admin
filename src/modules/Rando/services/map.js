import Api from 'mc-tf-test/modules/Api';

export async function fetchAllLayers () {
  return Api.request('layer/');
}

export default { fetchAllLayers };
