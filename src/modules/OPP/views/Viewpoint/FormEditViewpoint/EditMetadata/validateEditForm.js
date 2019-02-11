export async function validateEdit (values) {
  const errors = {};

  if (!values.label) {
    errors.label = 'Requis';
  }

  return errors;
}

export default { validateEdit };
