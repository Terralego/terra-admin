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
  default: defaultText = '',
  sourceFieldId,
}) => {
  const { data_type: dataType = 5, round = 0 }  = layerFields.find(f =>
    sourceFieldId === f.sourceFieldId) || {};
  const fieldType = fieldTypes[dataType];
  const fieldTemplate = getFieldNameTemplate(field.name, fieldType, round, translate);

  return '<li class="details__column">\n'
    + `<span class="details__column-label">${field.label}</span>\n`
    + '<span class="details__column-value">\n'
    + `{% if ${field.name} %}\n`
    + `${prefix} {{ ${fieldTemplate} }} ${suffix}\n`
    + '{% else %}\n'
    + `${defaultText}\n`
    + '{% endif %}'
    + '</span>\n'
    + '</li>\n';
};

const createTemplate = (
  {
    field: { name: titleName } = {},
    default: defaultTitle = '',
  },
  sections,
  fields,
  translate = a => a,
) => {
  const sectionsTemplate = sections.map(({ name, children }) => {
    const sectionFields = children.map(getFieldTemplate(fields, translate));
    return '<section class="details__group">\n'
      + `<h3 class="details__subtitle">${name}</h3>\n`
      + '<ul class="details__list">\n'
      + `${sectionFields.join('\n')}\n`
      + '</ul>\n'
      + '</section>\n';
  });

  return '<div class="details">\n'
    + '<h2 class="details__title">\n'
    + `{% if ${titleName} %}\n`
    + `{{${titleName}}}\n`
    + '{% else %}\n'
    + `${defaultTitle}\n`
    + '{% endif %}\n'
    + '</h2>\n'
    + `${sectionsTemplate.join('\n')}\n`
    + '</div>\n';
};

export default createTemplate;
