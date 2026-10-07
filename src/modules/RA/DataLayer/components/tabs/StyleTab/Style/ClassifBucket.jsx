import React from 'react';
import * as Plot from '@observablehq/plot';
import { useLocale } from 'react-admin';

import PlotChart from './PlotChart';

const ClassifBucket = ({ breaksData }) => {
  const locale = useLocale();

  const options = React.useMemo(() => {
    if (!breaksData || breaksData.length === 0) return null;

    const colorNbIndiv = breaksData.map(d => ({ color: d.color, nb: d.count }));

    return {
      height: 48,
      margin: 3,
      x: { axis: false, padding: 0.06 },
      y: { axis: false, domain: [0, 1] },
      marks: [
        // Barres de couleur par classe
        Plot.rect(colorNbIndiv, {
          x: (d, i) => i,
          y: 0,
          y2: 1,
          fill: 'color',
        }),
        // Effectif par classe
        Plot.text(colorNbIndiv, {
          text: d => d.nb.toLocaleString(locale),
          x: (d, i) => i,
          y: 0.5,
          frameAnchor: 'middle',
          fill: 'white',
          stroke: 'black',
          strokeWidth: 1.2,
          fontSize: 13,
          fontWeight: 'bold',
        }),
      ],
    };
  }, [breaksData, locale]);

  if (!options) return null;

  return <PlotChart options={options} />;
};

export default ClassifBucket;
