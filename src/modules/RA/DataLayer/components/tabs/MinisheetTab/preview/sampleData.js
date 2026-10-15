import { fieldTypes } from '../../../../../DataSource';

const sampleValue = ({ data_type: dataType, label, name }, index) => {
  switch (fieldTypes[dataType]) {
    case 'Integer':
      return 100 * (index + 1);
    case 'Float':
      return 123.4567 * (index + 1);
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
  Object.fromEntries(fields.filter(({ name }) => name).map((field, index) => [field.name, sampleValue(field, index)]));

export default createSampleData;
