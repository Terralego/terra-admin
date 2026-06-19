import React from 'react';
import { useField } from 'react-final-form';
import Api from '@terralego/core/modules/Api';

import { makeStyles } from '@material-ui/core/styles';

import styles from './styles';
import DistribGraph from './DistribGraph';

const useStyles = makeStyles(styles);

const DistribPreview = ({ layerName, path }) => {
  const classes = useStyles();

  const fieldName = `${path}.field`;
  const { input: { value: selectedField } } = useField(fieldName,
    { subscription: { value: true } });

  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const chartRef = React.useRef(null);

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

  if (!selectedField) return null;
  if (!data) return null;

  return (
    <div className={classes.discretContainer} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      {loading && <div>Chargement du graphique...</div>}
      <strong>Distribution</strong>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
        <DistribGraph chartRef={chartRef} data={data} />
      </div>
    </div>
  );
};

export default DistribPreview;
