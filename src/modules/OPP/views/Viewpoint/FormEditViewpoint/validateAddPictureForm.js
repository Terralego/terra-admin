
export async function validateAddPicture (values) {
  const errors = {};
  if (!values.datePicture) {
    errors.datePicture = 'Requis';
  }
  if (!values.picture) {
    errors.picture = 'Requis';
  }
  return errors;
}

export default { validateAddPicture };
