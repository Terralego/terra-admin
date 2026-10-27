const toNumber = value => {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }
  if (typeof value === 'string' && value.trim() !== '') {
    const number = Number(value);
    return Number.isFinite(number) ? number : null;
  }
  return null;
};

/** Whether a series has a fixed value instead of a field of the object. */
export const isFixedSeries = series => 'value' in series;

const seriesValue = (series, properties) =>
  toNumber(isFixedSeries(series) ? series.value : properties[series.field]);

/**
 * Data of a Chart block for the properties of an object: one bar or slice
 * per series, valued by its field or its fixed value. A null or non numeric
 * value is left out.
 */
export const getChartData = (series = [], properties = {}) => series
  .filter(item => seriesValue(item, properties) !== null)
  .map(item => Object.assign(
    { label: item.label || item.field || '', value: seriesValue(item, properties) },
    item.color && { color: item.color },
  ));

export default getChartData;
