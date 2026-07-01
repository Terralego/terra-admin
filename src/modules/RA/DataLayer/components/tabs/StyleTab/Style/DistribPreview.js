import React from 'react';
import { useField } from 'react-final-form';
import Api from '@terralego/core/modules/Api';

import { makeStyles } from '@material-ui/core/styles';

import Loading from '../../../../../../../components/Loading';
import styles from './styles';
import DistribGraph from './DistribGraph';

const useStyles = makeStyles(styles);

const DistribPreview = ({ layerName, path }) => {
  const classes = useStyles();

  const fieldName = `${path}.field`;
  const { input: { value: selectedField } } = useField(fieldName,
    { subscription: { value: true } });

  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    let cancelled = false;

    if (layerName && selectedField) {
      setData(null);
      Api.request(`geo-api/${layerName}/feature/stats/${selectedField}/distribution/`)
        .then(resp => {
          if (!cancelled) {
            setData(resp);
          }
        })
        .catch(() => {
          if (!cancelled) {
            setData(null);
          }
        });
    } else {
      setData(null);
    }

    return () => { cancelled = true; };
  }, [layerName, selectedField]);

  if (!selectedField) return null;

  return (
    <div className={classes.discretContainer} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', minHeight: 250 }}>
        {data ? (
          <DistribGraph data={data} />
        ) : (
          <Loading spinner />
        )}
      </div>
    </div>
  );
};

export default DistribPreview;
