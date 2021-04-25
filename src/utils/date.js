import i18n from 'i18next';

export function dateFormat (date) {
  return new Date(date).toDateString();
}


export const localErrorMessages = {
  overlappingDatesMessage: i18n.t('date.error.overlapping-date'),
  invalidDateMessage: i18n.t('date.error.invalid-date'),
};

export const locale = i18n.language;

export function toLocaleDateString (date) {
  if (!date) {
    return '';
  }
  const d = new Date(date);
  return d.toLocaleDateString(locale);
}
/* ISO 8601 date format compatible with django filter */
export const ISODateFormat = date => date.toISOString().split('T')[0];

export default { dateFormat, localErrorMessages, locale, toLocaleDateString };
