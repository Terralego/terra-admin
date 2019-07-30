import Api from '@terralego/core/modules/Api';
import config from './mock-config.json';

export async function fetchMapConfig () {
  // Mock api the config return
  return {
    results: { ...config },
  };
}

export async function fetchAllLayers () {
  return Api.request('layer/');
}

export default { fetchMapConfig, fetchAllLayers };
