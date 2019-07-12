const isEmpty = value => value.length < 1
  || (Array.isArray(value) && !value.some(elem => elem !== null))
  || (typeof value === 'string' && value === '');

const removeEmptyProperties = obj =>
  Object.keys(obj).reduce((acc, key) =>
    (isEmpty(obj[key]) ? acc : { ...acc, [key]: obj[key] }), {});

export function parsePropertiesToData (properties) {
  const data = removeEmptyProperties(properties);
  let parseDate = {};

  if (data.viewpointDate) {
    if (data.viewpointDate.every(date => date !== null)) {
      parseDate = {
        date__form: data.viewpointDate[0].toLocaleDateString(),
        date__to: data.viewpointDate[1].toLocaleDateString(),
      };
    } else {
      const pos = data.viewpointDate.findIndex(date => date !== null);
      parseDate = pos === 0
        ? { date__form: data.viewpointDate[pos].toLocaleDateString() }
        : { date__to: data.viewpointDate[pos].toLocaleDateString() };
    }

    // Destructuring to remove useless properties viewpointDate
    const { viewpointDate, ...props } = data;
    return {
      ...props,
      ...parseDate,
    };
  }
  return data;
}

export const isDate = date => new Date(date).getDate() > 0;

export default { parsePropertiesToData, isDate };
