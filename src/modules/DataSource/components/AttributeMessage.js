import React from 'react';

/* eslint-disable import/no-extraneous-dependencies */
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
/* eslint-enable */

const AttributeMessage = () => (
  <Card style={{ marginTop: '1em' }}>
    <CardContent>
      <Typography color="textSecondary">
        It is required to include fields in Vector Tiles for being also
        available in popup and mini-fiche templates.
      </Typography>
    </CardContent>
  </Card>
);

export default AttributeMessage;
