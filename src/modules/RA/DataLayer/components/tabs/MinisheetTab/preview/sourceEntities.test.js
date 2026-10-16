import { entityLabel, toEntity } from './sourceEntities';

describe('toEntity', () => {
  it('keeps the identifier and the properties, without the search match', () => {
    expect(toEntity({ id: 1, identifier: 'OCC-09', properties: { nom: 'Ariège', search_match: 'nom' } }))
      .toEqual({ identifier: 'OCC-09', properties: { nom: 'Ariège' } });
  });

  it('accepts an entity with no properties', () => {
    expect(toEntity({ identifier: 3 })).toEqual({ identifier: 3, properties: {} });
  });
});

describe('entityLabel', () => {
  const entity = { identifier: 'OCC-09', properties: { nom: 'Ariège', vide: '', zero: 0 } };

  it('uses the field of the title', () => {
    expect(entityLabel(entity, 'nom')).toBe('Ariège');
    expect(entityLabel(entity, 'zero')).toBe('0');
  });

  it('falls back on the identifier', () => {
    expect(entityLabel(entity)).toBe('OCC-09');
    expect(entityLabel(entity, 'vide')).toBe('OCC-09');
    expect(entityLabel(entity, 'absent')).toBe('OCC-09');
  });
});
