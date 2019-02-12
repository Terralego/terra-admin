import { Toaster } from '@blueprintjs/core';

export const FORM_ERROR_REQUIRED = 'required';
export const FORM_ERROR_IS_NUMBER = 'number';
export const FORM_ERROR_MIN_LENGTH = 'min-length';
export const FORM_ERROR_MAX_LENGTH = 'max-length';
export const FORM_ERROR_MIN_MAX = 'minmax';

export const validateRequired = value => !!value;
export const validateMinLength = (value, min) => +value >= min;
export const validateMaxLength = (value, max) => +value <= max;
export const validateIsNumber = value => !!(+value);

export const submitToaster = Toaster.create();

export default {
  FORM_ERROR_REQUIRED,
  FORM_ERROR_IS_NUMBER,
  FORM_ERROR_MIN_LENGTH,
  FORM_ERROR_MAX_LENGTH,
  validateRequired,
  validateMinLength,
  validateMaxLength,
  validateIsNumber,
  submitToaster,
};
