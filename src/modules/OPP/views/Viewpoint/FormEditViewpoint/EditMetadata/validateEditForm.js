import {
  FORM_ERROR_IS_NUMBER,
  FORM_ERROR_MIN_MAX,
  FORM_ERROR_REQUIRED,
  validateIsNumber,
  validateMaxLength,
  validateMinLength,
} from '../../../../../../utils/form';

export async function validateEdit (values) {
  const errors = {};

  if (!values.label) {
    errors.label = FORM_ERROR_REQUIRED;
  }

  if (values.pictureFile) {
    if (!values.date) {
      errors.date = FORM_ERROR_REQUIRED;
    }
  }

  if (values.longitude) {
    if (validateIsNumber(values.longitude)) {
      if (
        !(validateMinLength(values.longitude, -180) && validateMaxLength(values.longitude, 180))
      ) {
        errors.longitude = FORM_ERROR_MIN_MAX;
      }
    } else {
      errors.longitude = FORM_ERROR_IS_NUMBER;
    }
  } else {
    errors.longitude = FORM_ERROR_REQUIRED;
  }

  if (values.latitude) {
    if (validateIsNumber(values.latitude)) {
      if (!(validateMinLength(values.latitude, -90) && validateMaxLength(values.latitude, 90))) {
        errors.latitude = FORM_ERROR_MIN_MAX;
      }
    } else {
      errors.latitude = FORM_ERROR_IS_NUMBER;
    }
  } else {
    errors.latitude = FORM_ERROR_REQUIRED;
  }

  return errors;
}

export default { validateEdit };
