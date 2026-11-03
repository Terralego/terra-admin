/**
 * Pure helpers of a graph, shared by the widgets and the minisheet. The
 * settings are those of `<widget>.graph`: type, orientation, decimals,
 * percent and unit. The data is a list of `{ label, value, color? }`.
 */

import { blueberryTwilightPalette } from '@mui/x-charts/colorPalettes';

/** Colors of the graphs, in the order they are given to their values. */
export const GRAPH_PALETTE = blueberryTwilightPalette('light');

export const GRAPH_TYPES = ['bars', 'stacked-bars', 'pie'];
export const GRAPH_ORIENTATIONS = ['vertical', 'horizontal'];

/** Values as a share of their total, in percent. */
export const toPercent = data => {
  const total = data.reduce((sum, { value }) => sum + value, 0);
  return data.map(item => ({ ...item, value: total ? (item.value / total) * 100 : 0 }));
};

/** How a value is shown, by the decimals, percent and unit of the graph. */
export const formatGraphValue = (value, { decimals, percent, unit } = {}) => {
  if (value === null || value === undefined) {
    return null;
  }
  const displayValue = decimals !== undefined && decimals !== null && decimals !== ''
    ? value.toFixed(decimals)
    : value;
  if (percent) {
    return `${displayValue} %`;
  }
  if (unit) {
    return `${displayValue} (${unit})`;
  }
  return displayValue;
};

/** Label of the value axis. */
export const getValueAxisLabel = ({ percent, unit } = {}) => {
  if (percent) {
    return 'Total (%)';
  }
  if (unit) {
    return `Total (${unit})`;
  }
  return 'Total';
};
