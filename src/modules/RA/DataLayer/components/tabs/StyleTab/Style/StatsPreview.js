import React from 'react';
import { useField } from 'react-final-form';
import Api from '@terralego/core/modules/Api';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  statsPreview: {
    padding: '8px 12px',
    background: '#f5f5f5',
    borderRadius: 4,
    marginTop: 8,
    fontSize: '0.9em',
  },
  grid: {
    margin: '4px 0',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '2px 12px',
  },
});

const StatsPreview = ({ layerName, path }) => {
  const classes = useStyles();
  // champs sélectionné
  const fieldName = `${path}.field`;
  const { input: { value: selectedField } } = useField(fieldName,
    { subscription: { value: true } });

  const [stats, setStats] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  // fetch
  React.useEffect(() => {
    let cancelled = false;

    if (layerName && selectedField) {
      setLoading(true);

      Api.request(`geo-api/${layerName}/feature/stats/${selectedField}/`)
        .then(data => {
          if (!cancelled) {
            setStats(data);
            setLoading(false);
          }
        })
        .catch(() => {
          if (!cancelled) {
            setStats(null);
            setLoading(false);
          }
        });
    } else {
      setStats(null);
    }

    return () => {
      cancelled = true;
    };
  }, [layerName, selectedField]);

  // rendu conditionnel
  if (!selectedField) return null;
  if (loading) return <div>Chargement du résumé...</div>;
  if (!stats) return null;

  return (
    <div className={classes.statsPreview}>
      <strong>Résumé statistiques</strong>
      <dl className={classes.grid}>
        <dt>Population</dt><dd>{stats.count}</dd>
        <dt>Minimum</dt><dd>{stats.min}</dd>
        <dt>Maximum</dt><dd>{stats.max}</dd>
        <dt>Moyenne</dt><dd>{stats.avg?.toFixed(2)}</dd>
        <dt>Médiane</dt><dd>{stats.median?.toFixed(2)}</dd>
        <dt>Ecart type</dt><dd>{stats.std_dev?.toFixed(2)}</dd>
      </dl>
    </div>
  );
};

export default StatsPreview;
