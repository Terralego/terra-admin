import React from 'react';
import { translate } from 'react-admin';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const Help = ({ translate: t }) => (
  <>
    <Card>
      <CardContent>
        <Typography variant="subtitle1" gutterBottom>{t('help.block-heading')}</Typography>
        <Typography color="textSecondary" paragraph>{t('datasource.form.help1')}</Typography>
      </CardContent>
    </Card>
  </>
);

export default translate(Help);
