export const getFieldFromId = (fieldId, fieldsList = []) =>
  (fieldsList.find(({ sourceFieldId }) => sourceFieldId === fieldId) || {});

export default {
  getFieldFromId,
};
