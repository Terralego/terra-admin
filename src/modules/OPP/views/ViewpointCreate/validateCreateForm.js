import {
  FORM_ERROR_REQUIRED,
  FORM_ERROR_IS_NUMBER,
  FORM_ERROR_MIN_MAX,
  validateRequired,
  validateMinLength,
  validateMaxLength,
  validateIsNumber,
} from '../../../../utils/form';

export async function validateCreate (values) {
  const errors = {};

  if (!validateRequired(values.label)) {
    errors.label = FORM_ERROR_REQUIRED;
  }

  if (validateRequired(values.pictureFile)) {
    if (!validateRequired(values.date)) {
      errors.date = FORM_ERROR_REQUIRED;
    }
  }

  if (!validateRequired(values.longitude)) {
    errors.longitude = FORM_ERROR_REQUIRED;
  } else if (!validateIsNumber(values.longitude)) {
    errors.longitude = FORM_ERROR_IS_NUMBER;
  } else if (!validateMinLength(values.longitude, -180)
    || !validateMaxLength(values.longitude, 180)) {
    errors.longitude = FORM_ERROR_MIN_MAX;
  }

  if (!validateRequired(values.latitude)) {
    errors.latitude = FORM_ERROR_REQUIRED;
  } else if (!validateIsNumber(values.latitude)) {
    errors.latitude = FORM_ERROR_IS_NUMBER;
  } else if (!validateMinLength(values.latitude, -90)
    || !validateMaxLength(values.latitude, 90)) {
    errors.latitude = FORM_ERROR_MIN_MAX;
  }

  return errors;
}

export default { validateCreate };
