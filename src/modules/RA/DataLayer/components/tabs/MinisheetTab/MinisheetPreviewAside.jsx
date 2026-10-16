import React from 'react';
import { useTranslate } from 'react-admin';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

/* eslint-disable import/no-extraneous-dependencies */
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import { makeStyles } from '@material-ui/core/styles';
/* eslint-enable */

import EntityPicker, { useDefaultEntity, useSourceSlug } from './EntityPicker';
import MinisheetPreview from './preview/MinisheetPreview';

const useStyles = makeStyles(theme => ({
  root: {
    alignSelf: 'flex-start',
    border:    `1px solid ${theme.palette.divider}`,
    [theme.breakpoints.up('lg')]: {
      flex:       '0 0 32em',
      minWidth:   0,
      marginLeft: '1em',
      position:   'sticky',
      top:        theme.spacing(2),
      display:       'flex',
      flexDirection: 'column',
      maxHeight:     `calc(100vh - ${theme.spacing(4)}px)`,
    },
    [theme.breakpoints.down('md')]: {
      marginTop: '1em',
    },
  },
  content: {
    flex:      1,
    minHeight: 0,
    overflow:  'auto',
  },
}));

/**
 * Aside of the minisheet tab: the minisheet rendered on an entity of the
 * source, the first one by default, or another one found by a search.
 */
export const MinisheetPreviewAside = ({ preview: { config, source, entity, setEntity } }) => {
  const classes = useStyles();
  const translate = useTranslate();

  const slug = useSourceSlug(source);
  useDefaultEntity(slug, entity, setEntity);

  return (
    <Card elevation={0} className={`${classes.root} sticky-aside`}>
      <CardHeader
        title={translate('datalayer.form.minisheet.preview.title')}
        titleTypographyProps={{ variant: 'subtitle1' }}
      />
      {slug && (
        <Box sx={{ px: 2 }}>
          <EntityPicker slug={slug} entity={entity} setEntity={setEntity} titleField={config?.title?.field} />
        </Box>
      )}
      <CardContent className={classes.content}>
        {entity === undefined && slug !== null && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}><CircularProgress size={24} /></Box>
        )}
        {(entity === null || slug === null) && (
          <Alert severity="info">{translate('datalayer.form.minisheet.preview.no-entity')}</Alert>
        )}
        {entity && <MinisheetPreview config={config} properties={entity.properties} />}
      </CardContent>
    </Card>
  );
};

export default MinisheetPreviewAside;
