import React, { useCallback, useState } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { useInput } from 'ra-core';
import { blueberryTwilightPalette } from '@mui/x-charts/colorPalettes';
import { PieChart } from '@mui/x-charts';

const GRAPH_HEIGHT = 280;
export const GRAPH_WIDTH = 280;
const GRAPH_HORIZONAL_MARGIN = 30;
const GRAPH_VERTICAL_MARGIN = 10;

function WidgetGraphPreview ({ source }) {
  const [highlightedItem, setHighLightedItem] = useState(null);

  const {
    input: { value: graphTypeValue },
  } = useInput({ source: `${source}.graph.type` });
  const {
    input: { value: orientation },
  } = useInput({ source: `${source}.graph.orientation` });
  const {
    input: { value: decimals },
  } = useInput({ source: `${source}.graph.decimals` });
  const {
    input: { value: isPercent },
  } = useInput({ source: `${source}.graph.percent` });
  const {
    input: { value: unit },
  } = useInput({ source: `${source}.graph.unit` });

  const originalData = [
    { label: 'Data 1', value: 5.120 },
    { label: 'Data 2', value: 50.45621 },
    { label: 'Data 3', value: 10.4896546 },
    { label: 'Data 4', value: 63 }];

  let data = originalData;
  if (isPercent) {
    const total = originalData.reduce((prev, curr) => prev + curr.value, 0);
    data = originalData.map(d => ({ label: d.label, value: (d.value / total) * 100 }));
  }

  const graphColorPalette = blueberryTwilightPalette;

  const valueFormatter = useCallback(value => {
    if (value === null) {
      return null;
    }
    let displayValue = value;
    if (decimals !== undefined && decimals !== null) {
      displayValue = value.toFixed(decimals);
    }
    if (isPercent) {
      return `${displayValue} %`;
    }
    if (unit) {
      return `${displayValue} (${unit})`;
    }
    return displayValue;
  }, [decimals, isPercent, unit]);

  const getYLabel = () => {
    if (isPercent) {
      return 'Total (%)';
    }
    if (unit) {
      return `Total (${unit})`;
    }
    return 'Total';
  };

  if (graphTypeValue === 'bars') {
    const bandAxis = [{
      scaleType: 'band',
      dataKey: 'label',
      tickLabelStyle: {
        angle: orientation === 'horizontal' ? -45 : 60,
        textAnchor: orientation === 'horizontal' ? 'end' : 'start',
        fontSize: 10,
      },
      tickLabelPlacement: 'middle',
    }];
    const valueAxis = [{
      label: getYLabel(),
      domainLimit: isPercent ? () => ({
        min: 0,
        max: 100,
      }) : undefined,
    }];
    return (
      <div style={{ width: GRAPH_WIDTH, height: GRAPH_WIDTH }}>
        <BarChart
          dataset={data}
          layout={orientation}
          xAxis={orientation === 'horizontal' ? valueAxis : bandAxis}
          yAxis={orientation === 'horizontal' ? bandAxis : valueAxis}
          series={[
            {
              dataKey: 'value',
              highlightScope: { highlight: 'item', fade: 'global' },
              valueFormatter,
            },
          ]}
          height={GRAPH_HEIGHT}
          width={GRAPH_WIDTH}
          margin={{
            left: orientation === 'horizontal'
              ? GRAPH_HORIZONAL_MARGIN + 50
              : GRAPH_HORIZONAL_MARGIN + 10,
            right: GRAPH_HORIZONAL_MARGIN,
            top: GRAPH_VERTICAL_MARGIN,
            // Setting undefined is not the same as ommiting the key
            ...(orientation === 'horizontal' ? {} : { bottom: GRAPH_VERTICAL_MARGIN + 50 }),
          }}
          slotProps={{ legend: { hidden: true } }}
          colors={graphColorPalette}
          highlightedItem={highlightedItem}
          onHighlightChange={setHighLightedItem}
        />
      </div>
    );
  }

  if (graphTypeValue === 'stacked-bars') {
    const stackedData = [{ label: '' }];
    data.forEach(d => {
      stackedData[0][d.label] = d.value;
    });
    const bandAxis = [{
      scaleType: 'band',
      dataKey: 'label',
    }];
    const valueAxis = [{
      label: getYLabel(),
      domainLimit: isPercent ? () => ({
        min: 0,
        max: 100,
      }) : undefined,
    }];
    return (
      <div style={{ width: GRAPH_WIDTH, height: GRAPH_WIDTH }}>
        <BarChart
          dataset={stackedData}
          layout={orientation}
          xAxis={orientation === 'horizontal' ? valueAxis : bandAxis}
          yAxis={orientation === 'horizontal' ? bandAxis : valueAxis}
          series={data.map(d => ({
            dataKey: d.label,
            label: d.label,
            stack: 'stack',
            highlightScope: { highlight: 'item', fade: 'global' },
            valueFormatter,
          }))}
          tooltip={{ trigger: 'item' }}
          height={GRAPH_HEIGHT}
          width={GRAPH_WIDTH}
          margin={{
            left: orientation === 'horizontal' ? GRAPH_HORIZONAL_MARGIN : GRAPH_HORIZONAL_MARGIN + 10,
            right: GRAPH_HORIZONAL_MARGIN,
            top: GRAPH_VERTICAL_MARGIN,
            bottom: orientation === 'horizontal' ? GRAPH_VERTICAL_MARGIN + 30 : GRAPH_VERTICAL_MARGIN,
          }}
          slotProps={{ legend: { hidden: true } }}
          colors={graphColorPalette}
          highlightedItem={highlightedItem}
          onHighlightChange={setHighLightedItem}
        />
      </div>
    );
  }


  if (graphTypeValue === 'pie') {
    return (
      <div style={{ width: GRAPH_WIDTH, height: GRAPH_WIDTH }}>
        <PieChart
          series={[
            {
              data,
              innerRadius: 30,
              paddingAngle: 2,
              cornerRadius: 5,
              highlightScope: { highlight: 'item', fade: 'global' },
              valueFormatter: v => valueFormatter(v.value),
            },
          ]}
          width={GRAPH_WIDTH}
          height={GRAPH_HEIGHT}
          margin={{
            left: GRAPH_HORIZONAL_MARGIN,
            right: GRAPH_HORIZONAL_MARGIN,
            top: GRAPH_VERTICAL_MARGIN,
            bottom: GRAPH_VERTICAL_MARGIN,
          }}
          slotProps={{ legend: { hidden: true } }}
          colors={graphColorPalette}
          highlightedItem={highlightedItem}
          onHighlightChange={setHighLightedItem}
        />
      </div>
    );
  }

  return null;
}

export default WidgetGraphPreview;
