import { fieldTypes } from '../../../../../DataSource';

const sampleValue = ({ data_type: dataType, label, name }) => {
  switch (fieldTypes[dataType]) {
    case 'Integer':
      return 1234;
    case 'Float':
      return 1234.5678;
    case 'Boolean':
      return true;
    case 'Date':
      return '2026-10-14';
    case 'String':
    default:
      return label || name;
  }
};

/** Example properties of an object of the layer, one value per field, by type. */
export const createSampleData = (fields = []) =>
  Object.fromEntries(fields.filter(({ name }) => name).map(field => [field.name, sampleValue(field)]));

export default createSampleData;
