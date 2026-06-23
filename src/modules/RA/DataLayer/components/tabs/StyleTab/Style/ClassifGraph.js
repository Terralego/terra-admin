import React from 'react';
import * as Plot from '@observablehq/plot';

import PlotChart from './PlotChart';

export const MEAN_COLOR = '#044f81';
export const MEDIAN_COLOR = '#e67e22';
export const STDDEV_COLOR = '#525d5c';

const ClassifGraph = ({ breaksData, stats }) => {
  const options = React.useMemo(() => {
    if (breaksData.length === 0) return null;

    const plotRange = [breaksData[0].x1, breaksData[breaksData.length - 1].x2];

    const marks = [
      Plot.ruleY([0]),
      Plot.rectY(breaksData, {
        x1: 'x1',
        x2: 'x2',
        y: 'count',
        fill: 'color',
        channels: {
          count: d => d.count,
        },
        tip: {
          format: {
            count: true,
            fill: false,
            y: false,
            x: false,
          },
        },
      }),
    ];

    if (stats?.avg != null) {
      marks.push(Plot.ruleX([stats.avg], { stroke: MEAN_COLOR, strokeWidth: 1.8 }));
    }
    if (stats?.median != null) {
      marks.push(Plot.ruleX([stats.median], { stroke: MEDIAN_COLOR, strokeWidth: 1.8 }));
    }
    if (stats?.avg != null && stats?.std_dev != null) {
      marks.push(Plot.ruleX(
        [stats.avg - stats.std_dev, stats.avg + stats.std_dev],
        { stroke: STDDEV_COLOR, strokeWidth: 1.5, strokeDasharray: '4,4' },
      ));
    }

    return {
      height: 190,
      marginBottom: 24,
      marginTop: 12,
      x: {
        domain: plotRange,
        tickFormat: d => d.toLocaleString('fr'),
        label: null,
      },
      y: {
        nice: true,
        grid: false,
        label: null,
      },
      marks,
    };
  }, [breaksData, stats]);

  if (!options) return null;

  return <PlotChart options={options} />;
};

export default ClassifGraph;
