import React from 'react';
import * as Plot from '@observablehq/plot';

const MEAN_COLOR = '#e74c3c';
const MEDIAN_COLOR = '#27ae60';
const STDDEV_COLOR = '#95a5a6';

const ClassifGraph = ({ chartRef, breaksData, showOptions, stats }) => {
  React.useEffect(() => {
    if (breaksData.length === 0) {
      if (chartRef.current) {
        chartRef.current.replaceChildren();
      }
      return;
    }

    if (!chartRef.current) return;

    const maxCount = Math.max(...breaksData.map(d => d.count), 1);
    const adjustHeight = d => Math.max((d.count / maxCount) * 170, 0.5);
    const minmax = [breaksData[0].x1, breaksData[breaksData.length - 1].x2];

    try {
      const chart = Plot.plot({
        height: 200,
        marginBottom: 20,
        marginTop: 10,
        x: {
          domain: minmax,
          tickFormat: d => d.toLocaleString(),
        },
        y: {
          nice: false,
          grid: true,
          ticks: false,
        },
        marks: [
          Plot.rectY(breaksData, {
            x1: 'x1',
            x2: 'x2',
            y: d => adjustHeight(d),
            fill: 'color',
          }),
          Plot.ruleY([0]),
          ...(showOptions.mean && stats?.avg != null
            ? [Plot.ruleX([stats.avg], { stroke: MEAN_COLOR, strokeWidth: 2.5 })]
            : []),
          ...(showOptions.median && stats?.median != null
            ? [Plot.ruleX([stats.median], { stroke: MEDIAN_COLOR, strokeWidth: 2.5 })]
            : []),
          ...(showOptions.stddev && stats?.avg != null && stats?.std_dev != null
            ? [Plot.ruleX(
              [stats.avg - stats.std_dev, stats.avg + stats.std_dev],
              { stroke: STDDEV_COLOR, strokeWidth: 2.5 },
            )]
            : []),
        ],
      });

      chartRef.current.replaceChildren(chart);
    } catch (err) {
      // ignore
    }
  }, [chartRef, breaksData, showOptions, stats]);

  return <div ref={chartRef} />;
};

export default ClassifGraph;
