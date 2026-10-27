/**
 * Text of a Field block value, as the front shows it. The format comes from
 * the keys of `format`, not from the type of the field, which the front does
 * not know: `decimals` for a number, `date` for a date, `true`/`false` for a
 * boolean.
 */

export const isMissing = value => value === null || value === undefined || value === '';

const BOOLEAN_TEXTS = new Map([['true', true], ['false', false], ['1', true], ['0', false]]);

const toBoolean = value => (typeof value === 'boolean' ? value : BOOLEAN_TEXTS.get(String(value).toLowerCase()));

const toDate = value => {
  const day = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value));
  const date = day ? new Date(day[1], day[2] - 1, day[3]) : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const pad = number => String(number).padStart(2, '0');

const DATE_TOKENS = /yyyy|MMMM|MM|M|dd|d|EEEE|HH|mm|ss/g;

/** A date written with a pattern: yyyy, MMMM (month name), MM, M, dd, d, EEEE (day name), HH, mm, ss. */
export const formatDate = (date, pattern, locale) => pattern.replace(DATE_TOKENS, token => {
  switch (token) {
    case 'yyyy': return String(date.getFullYear());
    case 'MMMM': return date.toLocaleString(locale, { month: 'long' });
    case 'MM': return pad(date.getMonth() + 1);
    case 'M': return String(date.getMonth() + 1);
    case 'dd': return pad(date.getDate());
    case 'd': return String(date.getDate());
    case 'EEEE': return date.toLocaleString(locale, { weekday: 'long' });
    case 'HH': return pad(date.getHours());
    case 'mm': return pad(date.getMinutes());
    default: return pad(date.getSeconds());
  }
});

const formatNumber = (value, decimals, locale) => {
  const number = Number(value);
  if (typeof value === 'boolean' || Number.isNaN(number)) {
    return String(value);
  }
  return number.toLocaleString(locale, decimals === undefined
    ? undefined
    : { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
};

/**
 * `{ text, icon, dimmed }` of a value, the icon only for a boolean, `dimmed`
 * when false borrows the icon of true. A missing value
 * gives the `default` text (no prefix nor suffix), or null when there is none.
 */
export const formatValue = (value, { format = {}, prefix = '', suffix = '', default: defaultText = '' } = {}, locale) => {
  if (isMissing(value)) {
    return defaultText ? { text: defaultText } : null;
  }

  const boolean = 'true' in format || 'false' in format ? toBoolean(value) : undefined;
  if (boolean !== undefined) {
    const { text = '', icon = '' } = format[String(boolean)] ?? {};
    const trueIcon = format.true?.icon ?? '';
    if (!boolean && !icon && trueIcon) {
      return { text: `${prefix}${text}${suffix}`, icon: trueIcon, dimmed: true };
    }
    return { text: `${prefix}${text}${suffix}`, icon };
  }

  let text;
  if (format.date) {
    const date = toDate(value);
    text = date ? formatDate(date, format.date, locale) : String(value);
  } else if (format.decimals !== undefined || typeof value === 'number') {
    text = formatNumber(value, format.decimals, locale);
  } else {
    text = String(value);
  }
  return { text: `${prefix}${text}${suffix}` };
};

export default formatValue;
