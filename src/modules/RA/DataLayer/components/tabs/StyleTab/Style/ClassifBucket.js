import React from 'react';
import * as Plot from '@observablehq/plot';

import PlotChart from './PlotChart';

const ClassifBucket = ({ breaksData, entitiesByClass }) => {
  const options = React.useMemo(() => {
    if (!entitiesByClass) return null;

    const colorNbIndiv = breaksData.length > 0
      ? breaksData.map(d => ({ color: d.color, nb: d.count }))
      : entitiesByClass.map(count => ({ color: '#ccc', nb: count }));

    return {
      height: 48,
      margin: 3,
      x: { axis: false, padding: 0.06 },
      y: { axis: false, domain: [0, 1] },
      marks: [
        Plot.rect(colorNbIndiv, {
          x: (d, i) => i,
          y: 0,
          y2: 1,
          fill: 'color',
        }),
        Plot.text(colorNbIndiv, {
          text: d => d.nb.toLocaleString(),
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
  }, [breaksData, entitiesByClass]);

  if (!options) return null;

  return <PlotChart options={options} />;
};

export default ClassifBucket;
