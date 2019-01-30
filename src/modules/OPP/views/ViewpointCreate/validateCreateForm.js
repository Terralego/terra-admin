export async function validateCreate (values) {
  const errors = {};

  if (!values.label) {
    errors.label = 'Requis';
  }

  if (values.pictureFile) {
    if (!values.datePicture) {
      errors.datePicture = 'Requis';
    }
  }

  if (values.longitude) {
    if (+values.longitude) {
      if (values.longitude <= -180 || values.longitude >= 180) {
        errors.longitude = 'Must be between -180° and 180°';
      }
    } else {
      errors.longitude = 'Must be a number';
    }
  } else {
    errors.longitude = 'Requis';
  }

  if (values.latitude) {
    if (+values.latitude) {
      if (values.latitude <= -90 || values.latitude >= 90) {
        errors.latitude = 'Must be between -90° and 90°';
      }
    } else {
      errors.latitude = 'Must be a number';
    }
  } else {
    errors.latitude = 'Requis';
  }

  return errors;
}

export default { validateCreate };
