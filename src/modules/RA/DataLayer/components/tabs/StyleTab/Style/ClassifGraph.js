import React from 'react';
import * as Plot from '@observablehq/plot';

import PlotChart from './PlotChart';

export const MEAN_COLOR = '#090106';
export const MEDIAN_COLOR = '#a3b2b2';
export const STDDEV_COLOR = '#114a07';

const ClassifGraph = ({ breaksData, stats }) => {
  const options = React.useMemo(() => {
    if (breaksData.length === 0) return null;

    const plotRange = [breaksData[0].x1, breaksData[breaksData.length - 1].x2];
    const maxCount = Math.max(...breaksData.map(d => d.count), 1);

    const marks = [
      // Barres des classes (histogramme)
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
      // Moyenne
      marks.push(Plot.ruleX([stats.avg], {
        stroke: MEAN_COLOR,
        strokeWidth: 2.5,
        y1: 0,
        y2: maxCount * 1.1,
      }));
    }
    if (stats?.median != null) {
      // Médiane
      marks.push(Plot.ruleX([stats.median], {
        stroke: MEDIAN_COLOR,
        strokeWidth: 2.5,
        y1: 0,
        y2: maxCount * 1.1,
      }));
    }
    if (stats?.avg != null && stats?.std_dev != null) {
      // Écart-type
      marks.push(Plot.ruleX(
        [stats.avg - stats.std_dev, stats.avg + stats.std_dev],
        {
          stroke: STDDEV_COLOR,
          strokeWidth: 2,
          strokeDasharray: '4,4',
          y1: 0,
          y2: maxCount * 1.1,
        },
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
