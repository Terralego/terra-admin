import React from 'react';
import * as Plot from '@observablehq/plot';

import PlotChart from './PlotChart';

const DistribGraph = ({ data }) => {
  const { bins, boxplot, sample } = data || {};

  const aspect = React.useMemo(() => {
    if (!bins || bins.length === 0) return null;

    const maxCount = bins.reduce((max, b) => Math.max(max, b.count), 0);
    const baseline = maxCount * -0.28;
    const boxFloor = baseline;
    const boxCeiling = baseline * 0.18;
    const whiskerPos = (boxFloor + boxCeiling) / 2;

    const jitterPositions = sample?.length
      ? sample.map(() => boxFloor + Math.random() * (boxCeiling - boxFloor))
      : [];

    return { boxFloor, boxCeiling, whiskerPos, jitterPositions, maxCount };
  }, [bins, sample]);

  const options = React.useMemo(() => {
    if (!aspect) return null;

    const { boxFloor, boxCeiling, whiskerPos, jitterPositions } = aspect;

    return {
      height: 250,
      marginLeft: 35,
      marginBottom: 22,
      marginTop: 12,
      marginRight: 18,
      insetLeft: 8,
      marks: [
        // Histogramme de distribution
        Plot.ruleY([0]),
        Plot.rectY(bins, {
          x1: 'x0',
          x2: 'x1',
          y: 'count',
          fill: '#d4d4d4',
          stroke: '#b0b0b0',
        }),
        // Échantillon (jitter)
        ...(jitterPositions.length > 0
          ? [Plot.dot(sample, {
            x: d => d,
            y: (d, i) => jitterPositions[i],
            stroke: '#cc4444',
            fill: '#f5f0f0',
            r: 1.8,
          })]
          : []),
        // Médiane
        Plot.ruleX([boxplot.median], {
          stroke: '#2c2c2c',
          strokeWidth: 2.5,
          y1: boxFloor,
          y2: boxCeiling,
        }),
        // Boîte (Q1-Q3)
        Plot.rectX([boxplot], {
          x1: 'q1',
          x2: 'q3',
          y1: boxFloor,
          y2: boxCeiling,
          fill: 'none',
          stroke: '#2c2c2c',
          strokeWidth: 1.2,
        }),
        // Moustache inférieure (Q1-min)
        Plot.ruleY([boxplot], {
          x1: 'min',
          x2: 'q1',
          y: whiskerPos,
          stroke: '#2c2c2c',
          strokeWidth: 1.2,
        }),
        // Moustache supérieure (Q3-max)
        Plot.ruleY([boxplot], {
          x1: 'q3',
          x2: 'max',
          y: whiskerPos,
          stroke: '#2c2c2c',
          strokeWidth: 1.2,
        }),
      ],
      y: { ticks: 5, label: null },
      x: { tickFormat: d => d.toLocaleString('fr'), label: null },
    };
  }, [aspect, bins, boxplot, sample]);

  if (!options) return null;

  return <PlotChart options={options} />;
};

export default DistribGraph;
