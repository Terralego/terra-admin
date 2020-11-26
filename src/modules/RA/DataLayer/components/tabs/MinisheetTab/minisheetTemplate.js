import { fieldTypes } from '../../../../DataSource';

const getFieldNameTemplate = (fieldname, fieldtype, roundvalue, translate) => {
  switch (fieldtype) {
    case 'Float':
      return `(${fieldname} | round(${roundvalue})).toLocaleString()`;
    case 'Integer':
      return `(${fieldname}).toLocaleString()`;
    case 'Boolean':
      return fieldname
        ? translate('datalayer.form.minisheet.true')
        : translate('datalayer.form.minisheet.false');
    case 'String':
    default:
      return `${fieldname}`;
  }
};

const getFieldTemplate = (layerFields = [], translate) => ({
  field,
  prefix,
  suffix,
  default: defaultText,
  sourceFieldId,
}) => {
  const { data_type: dataType = 5, round = 0 }  = layerFields.find(f =>
    sourceFieldId === f.sourceFieldId) || {};
  const fieldType = fieldTypes[dataType];
  const fieldTemplate = getFieldNameTemplate(field.name, fieldType, round, translate);

  return '<li class="details__column">'
    + `<span class="details__column-label">${field.label}</span>`
    + '<span class="details__column-value">'
    + `{% if ${field.name} %}`
    + `${prefix} {{ ${fieldTemplate} }} ${suffix}`
    + '{% else %}'
    + `${defaultText}`
    + '{% endif %}'
    + '</span>'
    + '</li>';
};

const createTemplate = (title, sections, fields, translate = a => a) => {
  const sectionsTemplate = sections.map(({ name, children }) => {
    const sectionFields = children.map(getFieldTemplate(fields, translate));
    return '<section class="details__group">'
      + `<h3 class="details__subtitle">${name}</h3>`
      + '<ul class="details__list">'
      + `${sectionFields.join('\n')}`
      + '</ul>'
      + '</section>';
  });

  return '<div class="details">'
    + `<h2 class="details__title">{{${title.field.name}}}</h2>`
    + `${sectionsTemplate.join('\n')}`
    + '</div>';
};

export default createTemplate;
