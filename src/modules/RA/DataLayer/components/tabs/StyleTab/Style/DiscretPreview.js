import React from 'react';
import { useField } from 'react-final-form';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as Plot from '@observablehq/plot';
import Api from '@terralego/core/modules/Api';

import { makeStyles } from '@material-ui/core/styles';

// couleurs des lignes de repère
const MEAN_COLOR = '#e74c3c';
const MEDIAN_COLOR = '#27ae60';
const STDDEV_COLOR = '#95a5a6';

const useStyles = makeStyles({
  container: {
    padding: '8px 12px',
    background: '#f5f5f5',
    borderRadius: 4,
    marginTop: 8,
  },
  toggles: {
    display: 'flex',
    justifyContent: 'space-around',
    marginTop: 8,
    '& label': {
      cursor: 'pointer',
      fontSize: '0.85em',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
    },
  },
});

const DiscretPreview = ({ layerName, path }) => {
  const classes = useStyles();

  const fieldName = `${path}.field`;
  const { input: { value: selectedField } } = useField(fieldName,
    { subscription: { value: true } });

  const methodName = `${path}.method`;
  const { input: { value: method } } = useField(methodName,
    { subscription: { value: true } });

  const valuesName = `${path}.values`;
  const { input: { value: values } } = useField(valuesName,
    { subscription: { value: true } });

  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const chartRef = React.useRef(null);
  const bucketRef = React.useRef(null);

  const [showOptions, setShowOptions] = React.useState({
    mean: false,
    median: false,
    stddev: false,
  });

  const toggle = key => () => {
    setShowOptions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const classCount = values?.length || 0;

  React.useEffect(() => {
    let cancelled = false;

    if (layerName && selectedField && method && classCount >= 2) {
      setData(null);
      setLoading(true);
      Api.request(
        `geo-api/${layerName}/feature/discretize/${selectedField}/`
        + `?method=${method}&classes=${classCount}`,
      )
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
  }, [layerName, selectedField, method, classCount]);

  // classification plot
  React.useEffect(() => {
    if (!data) {
      if (chartRef.current) {
        chartRef.current.replaceChildren();
      }
      return;
    }

    if (!chartRef.current) return;

    const { breaks, entitiesByClass, stats } = data;
    if (!breaks || breaks.length < 2 || !entitiesByClass) return;

    const isColor = typeof values?.[0] === 'string';
    const palette = isColor ? values : undefined;

    const breaksData = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < breaks.length - 1; i++) {
      breaksData.push({
        x1: breaks[i],
        x2: breaks[i + 1],
        count: entitiesByClass[i] || 0,
        color: palette?.[i] || '#ccc',
      });
    }

    const maxCount = Math.max(...breaksData.map(d => d.count), 1);
    const adjustHeight = d => Math.max((d.count / maxCount) * 170, 0.5);

    const minmax = [breaks[0], breaks[breaks.length - 1]];

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
          // barres colorées par classe
          Plot.rectY(breaksData, {
            x1: 'x1',
            x2: 'x2',
            y: d => adjustHeight(d),
            fill: 'color',
          }),
          // ligne de base (y=0)
          Plot.ruleY([0]),
          // ligne moyenne
          ...(showOptions.mean && stats?.avg != null
            ? [Plot.ruleX([stats.avg], { stroke: MEAN_COLOR, strokeWidth: 2.5 })]
            : []),
          // ligne médiane
          ...(showOptions.median && stats?.median != null
            ? [Plot.ruleX([stats.median], { stroke: MEDIAN_COLOR, strokeWidth: 2.5 })]
            : []),
          // lignes écart-type (moyenne +/- écart-type)
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
  }, [data, showOptions, values]);

  // colored bucket bar
  React.useEffect(() => {
    if (!data) {
      if (bucketRef.current) {
        bucketRef.current.replaceChildren();
      }
      return;
    }

    if (!bucketRef.current) return;

    const { breaks, entitiesByClass } = data;
    if (!breaks || breaks.length < 2 || !entitiesByClass) return;

    const isColor = typeof values?.[0] === 'string';
    const palette = isColor ? values : undefined;

    const colorNbIndiv = entitiesByClass.map((count, i) => ({
      color: palette?.[i] || '#ccc',
      nb: count,
    }));

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
  }, [data, values]);

  if (!selectedField) return null;
  if (!data) return null;

  return (
    <div className={classes.container} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      {loading && <div>Chargement de la distribution par classe...</div>}
      <strong>Distribution par classe</strong>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
        <div ref={chartRef} />
      </div>
      <div className={classes.toggles}>
        <label htmlFor="discret-toggle-mean">
          <input id="discret-toggle-mean" type="checkbox" checked={showOptions.mean} onChange={toggle('mean')} />
          Moyenne
        </label>
        <label htmlFor="discret-toggle-median">
          <input id="discret-toggle-median" type="checkbox" checked={showOptions.median} onChange={toggle('median')} />
          Médiane
        </label>
        <label htmlFor="discret-toggle-stddev">
          <input id="discret-toggle-stddev" type="checkbox" checked={showOptions.stddev} onChange={toggle('stddev')} />
          Écart-type
        </label>
      </div>
      <div ref={bucketRef} />
    </div>
  );
};

export default DiscretPreview;
