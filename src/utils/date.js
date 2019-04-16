import i18n from 'i18next';

export function dateFormat (date) {
  return new Date(date).toDateString();
}

export const localErrorMessages = {
  overlappingDatesMessage: i18n.t('date.error.overlapping-date'),
  invalidDateMessage: i18n.t('date.error.invalid-date'),
};

export const locale = i18n.language;

export default { dateFormat, localErrorMessages, locale };
