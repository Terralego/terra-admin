import React from 'react';
import * as ObservablePlot from '@observablehq/plot';

const PlotChart = ({ options }) => {
  const ref = React.useRef(null);

  React.useEffect(() => {
    const el = ref.current;

    if (el) {
      try {
        const chart = ObservablePlot.plot(options);
        el.replaceChildren(chart);
      } catch (err) {
        // ignore
      }
    }

    return () => {
      if (el) el.replaceChildren();
    };
  }, [options]);

  return <div ref={ref} />;
};

export default PlotChart;
