/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { withNamespaces } from 'react-i18next';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const sanitizeRestProps = ({
  basePath, i18n, i18nOptions, id, index,
  lng, resource, source, tReady, ...rest
}) => rest;

const FieldSample = ({ t, record: { sample }, ...rest }) => (sample
  ? (
    <Card {...sanitizeRestProps(rest)}>
      <CardContent>
        <Typography color="textSecondary" gutterBottom>{t('datalayer.form.data-sample')}</Typography>
        {sample.join(', ')}
      </CardContent>
    </Card>
  )
  : <div />
);

export default withNamespaces()(FieldSample);
