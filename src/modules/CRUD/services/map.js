import config from './mock-config.json';

export async function fetchMapConfig () {
  // Mock api the config return
  return {
    results: { ...config },
  };
}

export default { fetchMapConfig };
