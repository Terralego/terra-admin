import React from 'react';
import { useField } from 'react-final-form';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as Plot from '@observablehq/plot';
import Api from '@terralego/core/modules/Api';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  container: {
    padding: '8px 12px',
    background: '#f5f5f5',
    borderRadius: 4,
    marginTop: 8,
  },
});

const DistribPreview = ({ layerName, path }) => {
  const classes = useStyles();

  // champ sélectionné
  const fieldName = `${path}.field`;
  const { input: { value: selectedField } } = useField(fieldName,
    { subscription: { value: true } });

  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const chartRef = React.useRef(null);

  // fetch
  React.useEffect(() => {
    let cancelled = false;

    if (layerName && selectedField) {
      setData(null);
      setLoading(true);
      Api.request(`geo-api/${layerName}/feature/stats/${selectedField}/distribution/`)
        .then(resp => {
          if (!cancelled) {
            setData(resp);
            setLoading(false);
          }
        })
        .catch(() => {
          if (!cancelled) {
            setData(null);
            setLoading(false);
          }
        });
    } else {
      setData(null);
    }

    return () => { cancelled = true; };
  }, [layerName, selectedField]);

  // plot
  React.useEffect(() => {
    if (!data) {
      if (chartRef.current) {
        chartRef.current.replaceChildren();
      }
      return;
    }

    if (!chartRef.current) return;

    const { bins, boxplot, sample } = data;
    if (!bins || bins.length === 0) return;

    const maxCount = bins.reduce((max, b) => Math.max(max, b.count), 0);
    const jitterHeight = maxCount * 0.35;
    const boxY1 = -jitterHeight;
    const boxY2 = -jitterHeight * 0.15;
    const whiskerY = (boxY1 + boxY2) / 2;

    try {
      const chart = Plot.plot({
        height: 260,
        marginLeft: 30,
        marginBottom: 20,
        marginTop: 10,
        marginRight: 15,
        insetLeft: 10,
        marks: [
          Plot.ruleY([0]),

          Plot.rectY(bins, {
            x1: 'x0',
            x2: 'x1',
            y: 'count',
            fill: '#ccc',
            stroke: '#999',
          }),

          ...(sample?.length
            ? [Plot.dot(sample, {
              x: d => d,
              y: () => boxY1 + Math.random() * (boxY2 - boxY1),
              stroke: '#ff3434',
              fill: '#f1ebeb',
              r: 2,
            })]
            : []),

          Plot.ruleX([boxplot.median], {
            stroke: 'black',
            strokeWidth: 3,
            y1: boxY1,
            y2: boxY2,
          }),
          Plot.rectX([boxplot], {
            x1: 'q1',
            x2: 'q3',
            y1: boxY1,
            y2: boxY2,
            fill: 'none',
            stroke: 'black',
            strokeWidth: 1.5,
          }),
          Plot.ruleY([boxplot], {
            x1: 'min',
            x2: 'q1',
            y: whiskerY,
            stroke: 'black',
            strokeWidth: 1.5,
          }),
          Plot.ruleY([boxplot], {
            x1: 'q3',
            x2: 'max',
            y: whiskerY,
            stroke: 'black',
            strokeWidth: 1.5,
          }),
        ],
        y: { ticks: 4, label: null },
        x: { tickFormat: d => d.toLocaleString(), label: null },
      });

      chartRef.current.replaceChildren(chart);
    } catch (err) {
      // ignore
    }
  }, [data]);

  if (!selectedField) return null;
  if (!data) return null;

  return (
    <div className={classes.container} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      {loading && <div>Chargement du graphique...</div>}
      <strong>Distribution</strong>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
        <div ref={chartRef} />
      </div>
    </div>
  );
};

export default DistribPreview;
