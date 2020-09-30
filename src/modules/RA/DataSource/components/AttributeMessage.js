import React from 'react';

import { withTranslation } from 'react-i18next';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

export const AttributeMessage = ({ t }) => (
  <Card style={{ marginTop: '1em' }}>
    <CardContent>
      <Typography color="textSecondary">
        {t('datasource.edit.message')}
      </Typography>
    </CardContent>
  </Card>
);

export default withTranslation()(AttributeMessage);
