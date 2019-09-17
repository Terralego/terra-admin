import config from './mock-config.json';

// Mock api the config return
export const fetchMapConfig = () => ({ ...config });

export default { fetchMapConfig };
