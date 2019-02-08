import {
  FORM_ERROR_REQUIRED,
  FORM_ERROR_IS_NUMBER,
  FORM_ERROR_MIN_MAX,
  validateRequired,
  validateMinLength,
  validateMaxLength,
  validateIsNumber,
} from '../../../../../../utils/form';

export async function validateEdit (values) {
  const errors = {};
  const errorsCoordinates = {
    geometry: {
      coordinates: [],
    },
  };

  if (!values.label) {
    errors.label = FORM_ERROR_REQUIRED;
  }

  if (values.pictureFile) {
    if (!values.date) {
      errors.date = FORM_ERROR_REQUIRED;
    }
  }

  if (values.geometry.coordinates[0]) {
    if (validateIsNumber(values.geometry.coordinates[0])) {
      if (!(validateMinLength(values.geometry.coordinates[0], -180)
        && validateMaxLength(values.geometry.coordinates[0], 180))
      ) {
        errorsCoordinates.geometry.coordinates[0] = FORM_ERROR_MIN_MAX;
      }
    } else {
      errorsCoordinates.geometry.coordinates[0] = FORM_ERROR_IS_NUMBER;
    }
  } else {
    errorsCoordinates.geometry.coordinates[0] = FORM_ERROR_REQUIRED;
  }

  if (values.geometry.coordinates[1]) {
    if (validateIsNumber(values.geometry.coordinates[1])) {
      if (!(validateMinLength(values.geometry.coordinates[1], -90)
        && validateMaxLength(values.geometry.coordinates[1], 90))) {
        errorsCoordinates.geometry.coordinates[1] = FORM_ERROR_MIN_MAX;
      }
    } else {
      errorsCoordinates.geometry.coordinates[1] = FORM_ERROR_IS_NUMBER;
    }
  } else {
    errorsCoordinates.geometry.coordinates[1] = FORM_ERROR_REQUIRED;
  }

  return (errorsCoordinates.geometry.coordinates.length > 0) ?
    { ...errors, ...errorsCoordinates } : errors;
}

export default { validateEdit };
