import React from 'react';
import { useTranslate } from 'react-admin';

/* eslint-disable import/no-extraneous-dependencies */
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
/* eslint-enable */

import MapPreview from '../../../../components/Map/MapPreview';
import useAppSettings from '../../../../hooks/useAppSettings';
import getBaseLayerStyle from '../../../../utils/baseLayerStyle';

const useStyles = makeStyles(theme => ({
  // RaEdit lays the form card and the aside out in a flex row, stretching both:
  // this column then lets the map take whatever height the form dictates.
  root: {
    display: 'flex',
    flexDirection: 'column',
    border: `1px solid ${theme.palette.divider}`,
    // Matches the breakpoint of useStackedAside: a fixed width only makes
    // sense while the form and the aside sit side by side.
    [theme.breakpoints.up('lg')]: {
      flex: '0 0 32em',
      marginLeft: '1em',
    },
    [theme.breakpoints.down('md')]: {
      marginTop: '1em',
    },
  },
  map: {
    flex: '1 1 auto',
    minHeight: 320,
  },
  empty: {
    padding: theme.spacing(3),
  },
  notice: {
    padding: theme.spacing(2, 3),
  },
}));

/**
 * Aside of the base layer edit view: the base layer as a map actually renders
 * it, rebuilt from the form values on every change (see BaseLayerForm, which
 * lifts them up).
 *
 * Falls back to the saved record before the form has reported anything.
 */
export const EditAside = ({ record, values }) => {
  const classes = useStyles();
  const translate = useTranslate();
  const { map: mapConfig = {} } = useAppSettings() || {};

  const source = values || record;
  const { style, unsupported } = React.useMemo(
    () => getBaseLayerStyle(source),
    [source],
  );

  return (
    <Card elevation={0} className={classes.root}>
      <CardHeader
        title={translate('baseLayer.form.preview.title')}
        titleTypographyProps={{ variant: 'subtitle1' }}
      />
      <Divider />
      {unsupported && (
        <Typography
          variant="body2"
          color="textSecondary"
          className={classes.notice}
        >
          {translate('baseLayer.form.preview.mapboxUnsupported')}
        </Typography>
      )}
      {style ? (
        <MapPreview
          className={classes.map}
          style={style}
          center={mapConfig.center}
          zoom={mapConfig.zoom}
        />
      ) : (
        <Typography
          variant="body2"
          color="textSecondary"
          className={classes.empty}
        >
          {translate('baseLayer.form.preview.unavailable')}
        </Typography>
      )}
    </Card>
  );
};

export default EditAside;
