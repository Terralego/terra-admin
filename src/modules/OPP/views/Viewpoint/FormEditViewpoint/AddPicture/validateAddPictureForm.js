import { FORM_ERROR_REQUIRED, validateRequired } from '../../../../../../utils/form';

export async function validateAddPicture (values) {
  const errors = {};

  if (!validateRequired(values.pictureFile)) {
    errors.pictureFile = FORM_ERROR_REQUIRED;
  }

  if (!validateRequired(values.date)) {
    errors.date = FORM_ERROR_REQUIRED;
  }

  return errors;
}

export default { validateAddPicture };
