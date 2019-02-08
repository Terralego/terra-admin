import { FORM_ERROR_REQUIRED } from '../../../../../../utils/form';

export async function validateAddPicture (values) {
  const errors = {};

  if (!values.pictureFile) {
    errors.pictureFile = FORM_ERROR_REQUIRED;
  }

  if (values.pictureFile) {
    if (!values.date) {
      errors.date = FORM_ERROR_REQUIRED;
    }
  }
  return errors;
}

export default { validateAddPicture };
