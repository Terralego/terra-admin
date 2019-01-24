export async function validateEdit (values) {
  const errors = {};
  if (!values.label) {
    errors.label = 'Requis';
  }
  return errors;
}

export async function validateUpload (values) {
  const errors = {};
  if (!values.datePicture) {
    errors.datePicture = 'Requis';
  }
  if (!values.picture) {
    errors.picture = 'Requis';
  }
  return errors;
}

export default { validateEdit, validateUpload };
