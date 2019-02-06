export async function validateCreate (values) {
  const errors = {};

  if (!values.label) {
    errors.label = 'required';
  }

  if (values.pictureFile) {
    if (!values.datePicture) {
      errors.datePicture = 'required';
    }
  }

  if (values.longitude) {
    if (+values.longitude) {
      if (values.longitude <= -180 || values.longitude >= 180) {
        errors.longitude = 'range-number';
      }
    } else {
      errors.longitude = 'number';
    }
  } else {
    errors.longitude = 'required';
  }

  if (values.latitude) {
    if (+values.latitude) {
      if (values.latitude <= -90 || values.latitude >= 90) {
        errors.latitude = 'range-number';
      }
    } else {
      errors.latitude = 'number';
    }
  } else {
    errors.latitude = 'required';
  }

  return errors;
}

export default { validateCreate };
