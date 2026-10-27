import formatValue, { formatDate } from './formatValue';

describe('formatValue', () => {
  it('rounds a number to the decimals, with the separators of the locale', () => {
    expect(formatValue(1234.5678, { format: { decimals: 2 } }, 'en-US')).toEqual({ text: '1,234.57' });
    expect(formatValue('12', { format: { decimals: 1 } }, 'en-US')).toEqual({ text: '12.0' });
    expect(formatValue(1234, {}, 'en-US')).toEqual({ text: '1,234' });
  });

  it('writes a date with its pattern, a date alone being a local day', () => {
    expect(formatValue('2026-10-04', { format: { date: 'dd/MM/yyyy' } })).toEqual({ text: '04/10/2026' });
    expect(formatValue('2026-10-04', { format: { date: 'EEEE d MMMM yyyy' } }, 'fr-FR'))
      .toEqual({ text: 'dimanche 4 octobre 2026' });
    expect(formatValue('pas une date', { format: { date: 'dd/MM/yyyy' } })).toEqual({ text: 'pas une date' });
  });

  it('gives the text and icon of a boolean, from a boolean or its text', () => {
    const format = { true: { text: 'Oui', icon: '✅' }, false: { text: 'Non', icon: '' } };
    expect(formatValue(true, { format })).toEqual({ text: 'Oui', icon: '✅' });
    expect(formatValue('false', { format: { ...format, true: { text: 'Oui' } } })).toEqual({ text: 'Non', icon: '' });
    expect(formatValue(0, { format: { ...format, false: { text: 'Non', icon: '❌' } } })).toEqual({ text: 'Non', icon: '❌' });
  });

  it('gives false the icon of true, dimmed, when it has none', () => {
    const format = { true: { text: 'Oui', icon: '✅' }, false: { text: 'Non', icon: '' } };
    expect(formatValue(false, { format })).toEqual({ text: 'Non', icon: '✅', dimmed: true });
  });

  it('adds the prefix and suffix around a value, not around the default', () => {
    expect(formatValue('Écrins', { prefix: 'Massif des ', suffix: '.' })).toEqual({ text: 'Massif des Écrins.' });
    expect(formatValue(null, { prefix: '>', default: 'Inconnu' })).toEqual({ text: 'Inconnu' });
  });

  it('gives nothing for a missing value without default, but keeps 0 and false', () => {
    expect(formatValue('', {})).toBeNull();
    expect(formatValue(undefined, {})).toBeNull();
    expect(formatValue(0, {}, 'en-US')).toEqual({ text: '0' });
    expect(formatValue(false, {})).toEqual({ text: 'false' });
  });
});

describe('formatDate', () => {
  it('writes hours, minutes and seconds', () => {
    expect(formatDate(new Date(2026, 0, 2, 3, 4, 5), 'd/M/yyyy HH:mm:ss')).toBe('2/1/2026 03:04:05');
  });
});
