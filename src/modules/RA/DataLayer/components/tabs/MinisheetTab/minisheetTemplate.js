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

const getFieldMetaData = (fieldId, fields) => {
  const {
    data_type: dataType = 5,
    round = 0,
    label = '',
    name,
  }  = fields.find(f => fieldId === f.sourceFieldId) || {};
  const fieldType = fieldTypes[dataType];
  return { fieldType, round, label, name };
};

const getFieldTemplate = (layerFields = [], translate) => ({
  prefix,
  suffix,
  default: defaultText = '',
  sourceFieldId,
}) => {
  const { fieldType, round, label, name } = getFieldMetaData(sourceFieldId, layerFields);
  const fieldTemplate = getFieldNameTemplate(name, fieldType, round, translate);

  return '<li class="details__column">\n'
    + `<span class="details__column-label">${label}</span>\n`
    + '<span class="details__column-value">\n'
    + `{% if ${name} %}\n`
    + `${prefix} {{ ${fieldTemplate} }} ${suffix}\n`
    + '{% else %}\n'
    + `${defaultText}\n`
    + '{% endif %}'
    + '</span>\n'
    + '</li>\n';
};

const getTemplateNode = (fields, translate) => node => {
  if (!node.group) {
    const { fieldType, round, label, name } = getFieldMetaData(node.sourceFieldId, fields);
    const fieldTemplate = getFieldNameTemplate(name, fieldType, round, translate);

    return `{% if ${name} %}\n`
    + `<span class="details__column-label">${label}</span>\n`
    + `<span class="details__column-value">${node.prefix} {{${fieldTemplate}}} ${node.suffix}</span>\n`
    + `{% else %}<span class="details__value">${node.default}</span>{% endif %}\n`;
  }

  const sectionFields = node.children.map(getFieldTemplate(fields, translate));
  return '<section class="details__group">\n'
    + `<h3 class="details__subtitle">${node.name}</h3>\n`
    + '<ul class="details__list">\n'
    + `${sectionFields.join('\n')}\n`
    + '</ul>\n'
    + '</section>\n';
};

const createTemplate = (
  {
    sourceFieldId,
    default: defaultTitle = '',
  },
  treeData,
  fields = [],
  translate = a => a,
) => {
  const titleField = fields.find(f => f.sourceFieldId === sourceFieldId) || {};
  const sectionsTemplate = treeData.map(getTemplateNode(fields, translate));
  return '<div class="details">\n'
    + '<h2 class="details__title">\n'
    + `{% if ${titleField.name} %}\n`
    + `{{${titleField.name}}}\n`
    + '{% else %}\n'
    + `${defaultTitle}\n`
    + '{% endif %}\n'
    + '</h2>\n'
    + `${sectionsTemplate.join('\n')}\n`
    + '</div>\n';
};

export default createTemplate;
