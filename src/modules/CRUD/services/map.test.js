import { fetchMapConfig } from './map';
import config from './mock-config.json';

it('should fetch config of the map', () => {
  expect(fetchMapConfig()).toEqual({ error: {}, results: { ...config } });
});
