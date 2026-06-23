import React from 'react';
import { useField } from 'react-final-form';
import Api from '@terralego/core/modules/Api';

import { makeStyles } from '@material-ui/core/styles';

import Loading from '../../../../../../../components/Loading';

const useStyles = makeStyles({
  statsPreview: {
    padding: '8px 12px',
    background: '#f5f5f5',
    borderRadius: 4,
    marginTop: 8,
    fontSize: '0.9em',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    '& td': {
      padding: '4px 8px',
      borderBottom: '1px solid #ccc',
    },
    '& td:first-child': {
      borderRight: '1px solid #ccc',
      fontWeight: 500,
    },
    '& td:last-child': {
      textAlign: 'right',
    },
    '& tr:last-child td': {
      borderBottom: 'none',
    },
  },
});

const StatsPreview = ({ layerName, path }) => {
  const classes = useStyles();
  // champs sélectionné
  const fieldName = `${path}.field`;
  const { input: { value: selectedField } } = useField(fieldName,
    { subscription: { value: true } });

  const [stats, setStats] = React.useState(null);

  // fetch
  React.useEffect(() => {
    let cancelled = false;

    if (layerName && selectedField) {
      setStats(null);

      Api.request(`geo-api/${layerName}/feature/stats/${selectedField}/`)
        .then(data => {
          if (!cancelled) {
            setStats(data);
          }
        })
        .catch(() => {
          if (!cancelled) {
            setStats(null);
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

  // juste une table/tableau avec les valeurs
  return (
    <div className={classes.statsPreview} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <strong style={{ visibility: stats ? 'visible' : 'hidden' }}>Résumé statistiques</strong>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', position: 'relative' }}>
        <table className={classes.table} style={{ visibility: stats ? 'visible' : 'hidden' }}>
          <tbody>
            <tr><td>Population</td><td>{stats?.count ?? ''}</td></tr>
            <tr><td>Minimum</td><td>{stats?.min ?? ''}</td></tr>
            <tr><td>Maximum</td><td>{stats?.max ?? ''}</td></tr>
            <tr><td>Moyenne</td><td>{stats?.avg ?? ''}</td></tr>
            <tr><td>Médiane</td><td>{stats?.median ?? ''}</td></tr>
            <tr><td>Ecart type</td><td>{stats?.std_dev ?? ''}</td></tr>
          </tbody>
        </table>
        {!stats && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Loading spinner />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsPreview;
