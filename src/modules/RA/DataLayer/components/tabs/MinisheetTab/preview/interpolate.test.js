import interpolate, { interpolateHref } from './interpolate';

describe('interpolate', () => {
  it('replaces each field by its value, with or without spaces', () => {
    expect(interpolate('{{nom}} ({{ altitude }} m)', { nom: 'Pic', altitude: 2877 })).toBe('Pic (2877 m)');
  });

  it('gives an empty string for a missing or null value, but keeps 0 and false', () => {
    expect(interpolate('[{{a}}|{{b}}|{{c}}|{{d}}]', { b: null, c: 0, d: false })).toBe('[||0|false]');
  });

  it('leaves text without fields untouched, and an empty text empty', () => {
    expect(interpolate('Massif { des Écrins }', {})).toBe('Massif { des Écrins }');
    expect(interpolate(undefined, {})).toBe('');
  });
});

describe('interpolateHref', () => {
  it('inserts values of fields in a link', () => {
    expect(interpolateHref('https://example.org/site/{{id}}', { id: 12 })).toBe('https://example.org/site/12');
    expect(interpolateHref('/sites/{{id}}', { id: 12 })).toBe('/sites/12');
  });

  it('refuses links that are not http(s), mailto, tel or relative', () => {
    expect(interpolateHref('{{url}}', { url: 'javascript:alert(1)' })).toBeNull();
    expect(interpolateHref('{{url}}', {})).toBeNull();
    expect(interpolateHref('mailto:{{mail}}', { mail: 'a@b.fr' })).toBe('mailto:a@b.fr');
  });
});
