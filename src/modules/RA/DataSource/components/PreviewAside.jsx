import React from 'react';
import { useTranslate } from 'react-admin';

/* eslint-disable import/no-extraneous-dependencies */
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';
/* eslint-enable */

import FilePreview, { formatSize } from './FilePreview';

const useStyles = makeStyles(theme => ({
  // RaEdit et RaCreate disposent le formulaire et l'aside en ligne flex, en les
  // étirant ; même largeur que les asides des fonds de carte et des couches.
  root: {
    alignSelf: 'flex-start',
    border:    `1px solid ${theme.palette.divider}`,
    [theme.breakpoints.up('lg')]: {
      flex:       '0 0 32em',
      minWidth:   0,
      marginLeft: '1em',
      // L'aperçu suit le défilement d'un long formulaire (CSV)
      position:   'sticky',
      top:        theme.spacing(2),
    },
    [theme.breakpoints.down('md')]: {
      marginTop: '1em',
    },
  },
}));

/**
 * Aside des vues de source de données : aperçu des données du fichier choisi,
 * ou de la source enregistrée. L'aperçu est calculé par le formulaire et
 * remonté jusqu'ici (voir usePreviewAside).
 */
export const PreviewAside = ({ preview }) => {
  const classes   = useStyles();
  const translate = useTranslate();

  const size = formatSize(preview.fileSize ?? preview.preview?.file_size);

  return (
    <Card elevation={0} className={`${classes.root} sticky-aside`}>
      <CardHeader
        title={translate('datasource.form.preview.title')}
        subheader={size || undefined}
        titleTypographyProps={{ variant: 'subtitle1' }}
      />
      <Divider />
      <CardContent>
        <FilePreview {...preview} />
      </CardContent>
    </Card>
  );
};

export default PreviewAside;
