import { formatGraphValue, getValueAxisLabel, toPercent } from './graph';

describe('toPercent', () => {
  it('gives each value its share of the total', () => {
    expect(toPercent([{ label: 'a', value: 1 }, { label: 'b', value: 3 }]))
      .toEqual([{ label: 'a', value: 25 }, { label: 'b', value: 75 }]);
  });

  it('gives zero when the total is zero', () => {
    expect(toPercent([{ label: 'a', value: 0 }])).toEqual([{ label: 'a', value: 0 }]);
  });
});

describe('formatGraphValue', () => {
  it('rounds, then adds the percent sign or the unit', () => {
    expect(formatGraphValue(1.2345, { decimals: 2 })).toBe('1.23');
    expect(formatGraphValue(12.5, { decimals: 0, percent: true, unit: 'm' })).toBe('13 %');
    expect(formatGraphValue(12, { unit: 'm' })).toBe('12 (m)');
    expect(formatGraphValue(null, {})).toBeNull();
  });
});

describe('getValueAxisLabel', () => {
  it('names the unit of the values', () => {
    expect(getValueAxisLabel({})).toBe('Total');
    expect(getValueAxisLabel({ percent: true, unit: 'm' })).toBe('Total (%)');
    expect(getValueAxisLabel({ unit: 'm' })).toBe('Total (m)');
  });
});
