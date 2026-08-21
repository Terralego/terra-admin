import { GET_LIST, GET_ONE, UPDATE } from 'react-admin';

import patchExtentDataProvider, { fromApi } from './patchExtentDataProvider';

jest.mock('../../modules/RA/ra-modules', () => ({ RES_EXTENT: 'extent' }));

const REUNION = {
  id: 3,
  category: 'DOM/TOM',
  name: 'Réunion',
  minLat: '-21.3897000',
  minLon: '55.2164000',
  maxLat: '-20.8717000',
  maxLon: '55.8367000',
  pictogram: '/media/reunion.png',
  adapts_to_theme: true,
};

describe('fromApi', () => {
  it('lays the bounds out as [minX, minY, maxX, maxY]', () => {
    expect(fromApi(REUNION).bbox).toEqual([55.2164, -21.3897, 55.8367, -20.8717]);
  });

  it('turns the served strings into numbers', () => {
    expect(fromApi(REUNION).bbox.every(Number.isFinite)).toBe(true);
  });

  it('renames what the admin reads', () => {
    expect(fromApi(REUNION)).toMatchObject({
      id: 3,
      name: 'Réunion',
      category: 'DOM/TOM',
      icon: '/media/reunion.png',
      adaptToTheme: true,
    });
    expect(fromApi({ ...REUNION, adapts_to_theme: false }).adaptToTheme).toBe(false);
  });

  it('keeps nothing else from the served record', () => {
    expect(Object.keys(fromApi(REUNION)).sort())
      .toEqual(['adaptToTheme', 'bbox', 'category', 'icon', 'id', 'name']);
  });
});

describe('patchExtentDataProvider', () => {
  const listing = { data: [REUNION], total: 1 };

  it('adapts a listing', async () => {
    const provider = patchExtentDataProvider(async () => listing);

    const { data, total } = await provider(GET_LIST, 'extent', {});

    expect(total).toEqual(1);
    expect(data[0].bbox).toEqual([55.2164, -21.3897, 55.8367, -20.8717]);
  });

  it('adapts a single record', async () => {
    const provider = patchExtentDataProvider(async () => ({ data: REUNION }));

    expect((await provider(GET_ONE, 'extent', {})).data.id).toEqual(3);
  });

  it('leaves every other resource and every write alone', async () => {
    const provider = patchExtentDataProvider(async () => listing);

    expect((await provider(GET_LIST, 'view', {})).data[0]).toBe(REUNION);
    expect((await provider(UPDATE, 'extent', {})).data[0]).toBe(REUNION);
  });
});
