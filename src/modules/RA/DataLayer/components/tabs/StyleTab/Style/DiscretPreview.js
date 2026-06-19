import React from 'react';
import { useField } from 'react-final-form';
import Api from '@terralego/core/modules/Api';

import { makeStyles } from '@material-ui/core/styles';

import styles from './styles';
import ClassifGraph from './ClassifGraph';
import ClassifBucket from './ClassifBucket';
import ClassifBornes from './ClassifBornes';
import ClassifToggles from './ClassifToggles';

const useStyles = makeStyles(styles);

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

  const breaksData = React.useMemo(() => {
    if (!data) return [];
    const { breaks, entitiesByClass } = data;
    if (!breaks || breaks.length < 2 || !entitiesByClass) return [];
    if (values && values.length !== breaks.length - 1) return [];

    const isColor = typeof values?.[0] === 'string';
    const palette = isColor ? values : undefined;

    const result = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < breaks.length - 1; i++) {
      result.push({
        x1: breaks[i],
        x2: breaks[i + 1],
        count: entitiesByClass[i] || 0,
        color: palette?.[i] || '#ccc',
      });
    }
    return result;
  }, [data, values]);

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

  if (!selectedField) return null;
  if (!data) return null;

  return (
    <div className={classes.discretContainer} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      {loading && <div>Chargement de la distribution par classe...</div>}
      <div style={{ display: 'flex', gap: 16 }}>
        <strong style={{ flex: 1 }}>Distribution par classe</strong>
        <strong style={{ minWidth: 160, paddingLeft: 12 }}>Bornes des classes</strong>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'stretch', gap: 16 }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
          <ClassifGraph
            chartRef={chartRef}
            breaksData={breaksData}
            showOptions={showOptions}
            stats={data.stats}
          />
        </div>
        <ClassifBornes breaksData={breaksData} />
      </div>
      <ClassifToggles showOptions={showOptions} onToggle={toggle} />
      <ClassifBucket
        bucketRef={bucketRef}
        breaksData={breaksData}
        entitiesByClass={data.entitiesByClass}
      />
    </div>
  );
};

export default DiscretPreview;
