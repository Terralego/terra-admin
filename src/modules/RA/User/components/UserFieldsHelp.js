import React from 'react';
import { translate } from 'react-admin';

/* eslint-disable import/no-extraneous-dependencies */
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
/* eslint-enable */

const Help = ({ translate: t }) => (
  <>
    <Card>
      <CardContent>
        <Typography variant="subtitle1" gutterBottom>{t('help.block-heading')}</Typography>
        <Typography color="textSecondary" paragraph>{t('user.help.superuser-create-user')}</Typography>
        <Typography color="textSecondary">{t('user.help.is_superuser')}</Typography>
        <Typography color="textSecondary">{t('user.help.is_active')}</Typography>
      </CardContent>
    </Card>
  </>
);

export default translate(Help);
