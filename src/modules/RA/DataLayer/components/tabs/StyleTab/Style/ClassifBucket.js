import React from 'react';
import * as Plot from '@observablehq/plot';

const ClassifBucket = ({ bucketRef, breaksData, entitiesByClass }) => {
  React.useEffect(() => {
    if (!entitiesByClass) {
      if (bucketRef.current) {
        bucketRef.current.replaceChildren();
      }
      return;
    }

    if (!bucketRef.current) return;

    const colorNbIndiv = breaksData.length > 0
      ? breaksData.map(d => ({ color: d.color, nb: d.count }))
      : entitiesByClass.map(count => ({ color: '#ccc', nb: count }));

    try {
      const bucket = Plot.plot({
        x: { ticks: false },
        y: { axis: false },
        margin: 10,
        height: 60,
        marks: [
          Plot.rect(colorNbIndiv, {
            fill: 'color',
            x1: (d, i) => i * 10,
            x2: (d, i) => i * 10 + 10,
            y1: 0,
            y2: 10,
            stroke: 'silver',
          }),
          Plot.text(colorNbIndiv, {
            text: d => d.nb.toLocaleString(),
            x: (d, i) => i * 10 + 5,
            textAnchor: 'middle',
            frameAnchor: 'middle',
            fontSize: 16,
            fontWeight: 'bold',
            fill: 'white',
            stroke: 'black',
            strokeWidth: 1.5,
          }),
        ],
      });

      bucketRef.current.replaceChildren(bucket);
    } catch (err) {
      // ignore
    }
  }, [bucketRef, breaksData, entitiesByClass]);

  return <div ref={bucketRef} />;
};

export default ClassifBucket;
