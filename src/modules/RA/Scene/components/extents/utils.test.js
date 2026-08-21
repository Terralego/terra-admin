import {
  getCategory,
  getExtentType,
  groupByCategory,
  getFitBoundsBbox,
  moveExtent,
  normalizeExtents,
  toFitBounds,
  validateExtraExtents,
} from './utils';

const BBOX = [-5, 41, 10, 51];

describe('getExtentType', () => {
  it('reads a view configured before territories existed as a single extent', () => {
    expect(getExtentType({ fitBounds: { coordinates: BBOX } })).toEqual('single');
    expect(getExtentType({})).toEqual('single');
    expect(getExtentType()).toEqual('single');
  });

  it('only follows the list when explicitly asked to', () => {
    expect(getExtentType({ extent_type: 'multiple' })).toEqual('multiple');
    expect(getExtentType({ extent_type: 'single', extra_extents: [3] }))
      .toEqual('single');
  });
});

describe('normalizeExtents', () => {
  it('keeps the picked ids, in order', () => {
    expect(normalizeExtents([7, 3, 'reunion'])).toEqual([7, 3, 'reunion']);
  });

  it('drops anything that is not an id', () => {
    expect(normalizeExtents([7, null, { name: 'Réunion' }, undefined, 3])).toEqual([7, 3]);
  });

  it('copes with a view that has no zone at all', () => {
    expect(normalizeExtents(undefined)).toEqual([]);
    expect(normalizeExtents([])).toEqual([]);
  });
});

describe('getFitBoundsBbox / toFitBounds', () => {
  it('round trips the legacy framing', () => {
    expect(getFitBoundsBbox({ fitBounds: toFitBounds(BBOX) })).toEqual(BBOX);
  });

  it('ignores an unusable one', () => {
    expect(getFitBoundsBbox({ fitBounds: { coordinates: [1, 2] } })).toEqual([]);
    expect(getFitBoundsBbox({})).toEqual([]);
    expect(toFitBounds([])).toEqual({});
  });
});

describe('validateExtraExtents', () => {
  const single = { config: { map_settings: { extent_type: 'single' } } };
  const multiple = { config: { map_settings: { extent_type: 'multiple' } } };
  const legacy = { config: { map_settings: { fitBounds: toFitBounds(BBOX) } } };

  it('never blocks a single extent, whatever it looks like', () => {
    expect(validateExtraExtents(undefined, legacy)).toBeUndefined();
    expect(validateExtraExtents([], single)).toBeUndefined();
    expect(validateExtraExtents(undefined, {})).toBeUndefined();
    expect(validateExtraExtents(undefined)).toBeUndefined();
  });

  it('ignores a zone list kept aside', () => {
    expect(validateExtraExtents([3, 7], single)).toBeUndefined();
  });

  it('wants at least one zone in the selector', () => {
    expect(validateExtraExtents([], multiple)).toBeTruthy();
    expect(validateExtraExtents(undefined, multiple)).toBeTruthy();
    expect(validateExtraExtents([3], multiple)).toBeUndefined();
  });

  it('lets an unknown id through, the catalogue may just be unreachable', () => {
    expect(validateExtraExtents([404], multiple)).toBeUndefined();
  });
});

describe('getCategory / groupByCategory', () => {
  const reunion = { id: 1, category: 'Océan Indien' };
  const mayotte = { id: 2, category: 'Océan Indien' };
  const guadeloupe = { id: 3, category: { id: 9, name: 'Antilles' } };
  const orphan = { id: 4 };

  it('reads a label as well as a nested object', () => {
    expect(getCategory(reunion)).toEqual('Océan Indien');
    expect(getCategory(guadeloupe)).toEqual('Antilles');
    expect(getCategory(orphan)).toEqual('');
    expect(getCategory()).toEqual('');
  });

  it('groups in catalogue order, the uncategorised last', () => {
    expect(groupByCategory([reunion, orphan, guadeloupe, mayotte])).toEqual([
      { category: 'Océan Indien', extents: [reunion, mayotte] },
      { category: 'Antilles', extents: [guadeloupe] },
      { category: '', extents: [orphan] },
    ]);
  });

  it('copes with an empty catalogue', () => {
    expect(groupByCategory([])).toEqual([]);
    expect(groupByCategory()).toEqual([]);
  });
});

describe('moveExtent', () => {
  it('moves an extent around', () => {
    expect(moveExtent(['a', 'b', 'c'], 2, 0)).toEqual(['c', 'a', 'b']);
    expect(moveExtent(['a', 'b', 'c'], 0, 1)).toEqual(['b', 'a', 'c']);
  });

  it('ignores out of bounds moves', () => {
    expect(moveExtent(['a', 'b'], 0, -1)).toEqual(['a', 'b']);
    expect(moveExtent(['a', 'b'], 1, 2)).toEqual(['a', 'b']);
  });
});
