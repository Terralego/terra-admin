import { getFieldFromId } from '../fieldTools';

const createTemplate = (popupfields, fields) => popupfields.map((
  {
    suffix,
    prefix,
    default: defaultTitle,
    sourceFieldId,
  },
  index,
) => {
  const { name, label, settings: { round } = {} } = getFieldFromId(sourceFieldId, fields);
  if (index === 0) {
    return (
      `{% if ${name} %}`
          + `# {{${name}}}`
          + `{% else %}# ${defaultTitle || ''}{% endif %}`
    );
  }
  if (round !== undefined) {
    return (
      `- ${label} : `
        + `{% if ${name} !== undefined %}`
        + ` ${prefix} {{ (${name} | round(${round})).toLocaleString() }} ${suffix}`
        + `{% else %}${defaultTitle}{% endif %}`
    );
  }
  return (
    `- ${label} : `
      + `{% if ${name} !== undefined %}`
      + `${prefix}  {{ ${name} }} ${suffix}`
      + `{% else %}${defaultTitle}{% endif %}`
  );
});
export default createTemplate;
