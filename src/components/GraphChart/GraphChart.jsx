import React, { useCallback, useState } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';

import { GRAPH_PALETTE, formatGraphValue, getValueAxisLabel, toPercent } from './graph';

const GRAPH_HORIZONAL_MARGIN = 30;
const GRAPH_VERTICAL_MARGIN = 10;

const highlightScope = { highlight: 'item', fade: 'global' };
const NO_GRAPH = {};
const NO_DATA = [];

/**
 * A bar, stacked bar or pie chart of `data` (`{ label, value, color? }`),
 * set by `graph` as a widget graph is. Without a width, the chart takes the
 * width of its container.
 */
export const GraphChart = ({ graph = NO_GRAPH, data: originalData = NO_DATA, width, height = 280 }) => {
  const [highlightedItem, setHighLightedItem] = useState(null);
  const { type, orientation = 'vertical', percent } = graph;

  const data = (percent ? toPercent(originalData) : originalData)
    .map(({ label, value, color }, index) => Object.assign({ id: index, label, value }, color && { color }));

  const valueFormatter = useCallback(value => formatGraphValue(value, graph), [graph]);

  const valueAxis = [{
    label: getValueAxisLabel(graph),
    domainLimit: percent ? () => ({ min: 0, max: 100 }) : undefined,
  }];
  const horizontal = orientation === 'horizontal';
  const common = {
    height,
    width,
    slotProps: { legend: { hidden: true } },
    colors: GRAPH_PALETTE,
    highlightedItem,
    onHighlightChange: setHighLightedItem,
  };

  if (type === 'bars') {
    const bandAxis = [{
      scaleType: 'band',
      dataKey: 'id',
      valueFormatter: id => data[id]?.label,
      tickLabelStyle: {
        angle: horizontal ? -45 : 60,
        textAnchor: horizontal ? 'end' : 'start',
        fontSize: 10,
      },
      tickLabelPlacement: 'middle',
      ...(data.some(({ color }) => color) && {
        colorMap: {
          type: 'ordinal',
          values: data.map(({ id }) => id),
          colors: data.map(({ color }) => color || GRAPH_PALETTE[0]),
        },
      }),
    }];
    return (
      <BarChart
        {...common}
        dataset={data}
        layout={orientation}
        xAxis={horizontal ? valueAxis : bandAxis}
        yAxis={horizontal ? bandAxis : valueAxis}
        series={[{ dataKey: 'value', highlightScope, valueFormatter }]}
        margin={{
          left: horizontal ? GRAPH_HORIZONAL_MARGIN + 50 : GRAPH_HORIZONAL_MARGIN + 10,
          right: GRAPH_HORIZONAL_MARGIN,
          top: GRAPH_VERTICAL_MARGIN,
          // Setting undefined is not the same as ommiting the key
          ...(horizontal ? {} : { bottom: GRAPH_VERTICAL_MARGIN + 50 }),
        }}
      />
    );
  }

  if (type === 'stacked-bars') {
    const stackedData = [Object.fromEntries([['label', ''], ...data.map(({ id, value }) => [`v${id}`, value])])];
    const bandAxis = [{ scaleType: 'band', dataKey: 'label' }];
    return (
      <BarChart
        {...common}
        dataset={stackedData}
        layout={orientation}
        xAxis={horizontal ? valueAxis : bandAxis}
        yAxis={horizontal ? bandAxis : valueAxis}
        series={data.map(({ id, label, color }) => Object.assign({
          dataKey: `v${id}`,
          label,
          stack: 'stack',
          highlightScope,
          valueFormatter,
        }, color && { color }))}
        tooltip={{ trigger: 'item' }}
        margin={{
          left: horizontal ? GRAPH_HORIZONAL_MARGIN : GRAPH_HORIZONAL_MARGIN + 10,
          right: GRAPH_HORIZONAL_MARGIN,
          top: GRAPH_VERTICAL_MARGIN,
          bottom: horizontal ? GRAPH_VERTICAL_MARGIN + 30 : GRAPH_VERTICAL_MARGIN,
        }}
      />
    );
  }

  if (type === 'pie') {
    return (
      <PieChart
        {...common}
        series={[{
          data,
          innerRadius: 30,
          paddingAngle: 2,
          cornerRadius: 5,
          highlightScope,
          valueFormatter: v => valueFormatter(v.value),
        }]}
        margin={{
          left: GRAPH_HORIZONAL_MARGIN,
          right: GRAPH_HORIZONAL_MARGIN,
          top: GRAPH_VERTICAL_MARGIN,
          bottom: GRAPH_VERTICAL_MARGIN,
        }}
      />
    );
  }

  return null;
};

export default GraphChart;
