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

  if (!validateRequired(values.label)) {
    errors.label = FORM_ERROR_REQUIRED;
  }

  if (!validateRequired(values.geometry.coordinates[0])) {
    errorsCoordinates.geometry.coordinates[0] = FORM_ERROR_REQUIRED;
  } else if (!validateIsNumber(values.geometry.coordinates[0])) {
    errorsCoordinates.geometry.coordinates[0] = FORM_ERROR_IS_NUMBER;
  } else if (!validateMinLength(values.geometry.coordinates[0], -180)
    || !validateMaxLength(values.geometry.coordinates[0], 180)) {
    errorsCoordinates.geometry.coordinates[0] = FORM_ERROR_MIN_MAX;
  }

  if (!validateRequired(values.geometry.coordinates[1])) {
    errorsCoordinates.geometry.coordinates[1] = FORM_ERROR_REQUIRED;
  } else if (!validateIsNumber(values.geometry.coordinates[1])) {
    errorsCoordinates.geometry.coordinates[1] = FORM_ERROR_IS_NUMBER;
  } else if (!validateMinLength(values.geometry.coordinates[1], -90)
    || !validateMaxLength(values.geometry.coordinates[1], 90)) {
    errorsCoordinates.geometry.coordinates[1] = FORM_ERROR_MIN_MAX;
  }

  return (errorsCoordinates.geometry.coordinates.length > 0) ?
    { ...errors, ...errorsCoordinates } : errors;
}

export default { validateEdit };
