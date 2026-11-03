import conditionMet from './conditionMet';

const when = (operator, value) => ({ field: 'x', operator, value });
const met = (condition, x) => conditionMet(condition, { x });

describe('conditionMet', () => {
  it('tells a value from a missing one, 0 and false being values', () => {
    [0, false, 'a'].forEach(x => expect(met(when('exists'), x)).toBe(true));
    [null, undefined, ''].forEach(x => {
      expect(met(when('exists'), x)).toBe(false);
      expect(met(when('not_exists'), x)).toBe(true);
    });
  });

  it('reads booleans the way the field format does', () => {
    [true, 1, 'true', 'oui'].forEach(x => expect(met(when('truthy'), x)).toBe(true));
    [false, 0, '0', 'False', null, ''].forEach(x => expect(met(when('falsy'), x)).toBe(true));
  });

  it('compares numbers as numbers, and the rest as texts', () => {
    expect(met(when('eq', '2'), 2.0)).toBe(true);
    expect(met(when('eq', ' ouvert '), 'ouvert')).toBe(true);
    expect(met(when('eq', 'Ouvert'), 'ouvert')).toBe(false);
    expect(met(when('neq', 'a'), 'b')).toBe(true);
    expect(met(when('eq', ''), null)).toBe(false);
    expect(met(when('neq', 'a'), null)).toBe(true);
  });

  it('reads a comma or a point as the decimal separator of the typed value', () => {
    expect(met(when('gt', '1,5'), 1.6)).toBe(true);
    expect(met(when('lt', '1.5'), 1.6)).toBe(false);
    expect(met(when('eq', '1 400,5'), 1400.5)).toBe(true);
  });

  it('orders numbers only', () => {
    expect(met(when('gt', '1500'), 2000)).toBe(true);
    expect(met(when('lt', '1500'), '2000')).toBe(false);
    expect(met(when('gt', '0'), 'abc')).toBe(false);
    expect(met(when('lt', '1'), null)).toBe(false);
  });

  it('reads the value of the turn of a Repeat block like any property', () => {
    expect(conditionMet({ field: '$value', operator: 'truthy' }, { $value: true })).toBe(true);
  });
});
