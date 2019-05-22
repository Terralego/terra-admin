import i18n from 'i18next';

export const required = () =>
  value => (value ? undefined : i18n.t('ra.validation.required'));

export const minLength = min =>
  value => (value && value.length < min ? i18n.t('ra.validation.minLength', { min }) : undefined);

export const maxLength = max =>
  value => (value && value.length > max ? i18n.t('ra.validation.maxLength', { max }) : undefined);

export const number = () =>
  value => (value && !(+value) ? i18n.t('ra.validation.number') : undefined);

export const minValue = min =>
  value => (value && value < min ? i18n.t('ra.validation.minValue', { min }) : undefined);

export const maxValue = max =>
  value => (value && value > max ? i18n.t('ra.validation.maxValue', { max }) : undefined);

export default { required, minLength, maxLength, number, minValue, maxValue };
