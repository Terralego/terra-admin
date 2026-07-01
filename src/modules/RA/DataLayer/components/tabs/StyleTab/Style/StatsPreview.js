import React from 'react';
import { useField } from 'react-final-form';
import { useTranslate } from 'react-admin';
import Api from '@terralego/core/modules/Api';

import { makeStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableRow } from '@material-ui/core';

import Loading from '../../../../../../../components/Loading';

const useStyles = makeStyles({
  table: {
    '& td': {
      padding: '4px',
    },
    '& td:last-child': {
      textAlign: 'right',
      padding: '4px 4px 4px 16px',
    },
    '& th': {
      textAlign: 'left',
      paddingLeft: 0,
    },
  },
});

const StatsPreview = ({ layerName, path }) => {
  const translate = useTranslate();
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
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <Table className={classes.table} style={{ width: '100%', visibility: stats ? 'visible' : 'hidden' }}>
        <TableBody>
          <TableRow>
            <TableCell component="th" scope="row">{translate('discret.toggle.rug')}</TableCell>
            <TableCell align="right">{stats?.count ?? ''}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row">{translate('discret.minimum')}</TableCell>
            <TableCell align="right">{stats?.min ?? ''}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row">{translate('discret.maximum')}</TableCell>
            <TableCell align="right">{stats?.max ?? ''}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row">{translate('discret.toggle.mean')}</TableCell>
            <TableCell align="right">{stats?.avg ?? ''}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row">{translate('discret.toggle.median')}</TableCell>
            <TableCell align="right">{stats?.median ?? ''}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row">{translate('discret.toggle.stddev')}</TableCell>
            <TableCell align="right">{stats?.std_dev ?? ''}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      {!stats && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Loading spinner />
        </div>
      )}
    </div>
  );
};

export default StatsPreview;
