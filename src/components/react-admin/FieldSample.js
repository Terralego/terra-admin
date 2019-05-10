/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const FieldSample = ({ record: { sample } }) => (sample
  ? (
    <Card>
      <CardContent>
        <Typography color="textSecondary" gutterBottom>Data sample</Typography>
        {sample}
      </CardContent>
    </Card>
  )
  : <div />
);

export default FieldSample;
