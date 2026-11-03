import { isMissing } from './formatValue';

export const OPERATORS = ['exists', 'not_exists', 'eq', 'neq', 'gt', 'lt', 'truthy', 'falsy'];

export const COMPARING = new Set(['eq', 'neq', 'gt', 'lt']);

const FALSY_TEXTS = new Set(['false', '0']);

const isTruthy = value => !isMissing(value) && value !== false && value !== 0
  && !FALSY_TEXTS.has(String(value).trim().toLowerCase());

const toNumber = value => {
  if (typeof value === 'boolean' || isMissing(value) || String(value).trim() === '') {
    return null;
  }
  const number = Number(value);
  return Number.isNaN(number) ? null : number;
};

const toTypedNumber = value => (typeof value === 'string'
  ? toNumber(value.replace(/\s/g, '').replace(',', '.'))
  : toNumber(value));

const isEqual = (value, expected) => {
  const [a, b] = [toNumber(value), toTypedNumber(expected)];
  if (a !== null && b !== null) {
    return a === b;
  }
  return String(value).trim() === String(expected ?? '').trim();
};

/**
 * Whether the condition of a Condition block holds for the properties of the
 * object. `gt` and `lt` only compare numbers. A missing value equals nothing,
 * and differs from everything.
 */
export const conditionMet = ({ field, operator = 'exists', value: expected } = {}, properties = {}) => {
  const value = field ? properties[field] : undefined;

  switch (operator) {
    case 'exists': return !isMissing(value);
    case 'not_exists': return isMissing(value);
    case 'truthy': return isTruthy(value);
    case 'falsy': return !isTruthy(value);
    case 'eq': return !isMissing(value) && isEqual(value, expected);
    case 'neq': return isMissing(value) || !isEqual(value, expected);
    case 'gt':
    case 'lt': {
      const [a, b] = [toNumber(value), toTypedNumber(expected)];
      if (a === null || b === null) {
        return false;
      }
      return operator === 'gt' ? a > b : a < b;
    }
    default: return false;
  }
};

export default conditionMet;
