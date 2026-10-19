const getUploadErrorMessage = (err, t, fallback) => {
  if (err?.status === 413) return t('datasource.form.file-too-large');
  return fallback ?? (err?.message || String(err));
};

export default getUploadErrorMessage;
