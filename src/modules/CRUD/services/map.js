import config from './mock-config.json';

// Mock api the config return
export const fetchMapConfig = () => ({ results: { ...config }, error: {} });

export default { fetchMapConfig };
