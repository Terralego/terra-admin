import React from 'react';
import { ArrayInput, SimpleFormIterator, TextInput, useTranslate, required } from 'react-admin';

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { Box } from '@material-ui/core';

import ReportFieldItem from './ReportFieldItem';

const useStyles = makeStyles(theme => ({
  configCard: {
    marginBottom: theme.spacing(2),
    border: `1px solid ${theme.palette.divider}`,
  },
  configHeader: {
    backgroundColor: theme.palette.grey[50],
    padding: theme.spacing(1, 2),
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
}));

const ReportConfigItem = ({ source }) => {
  const classes = useStyles();
  const translate = useTranslate();

  return (
    <Card className={classes.configCard}>
      <Box className={classes.configHeader}>
        <Typography variant="h6">{translate('datalayer.form.reporting.config-title')}</Typography>
      </Box>
      <CardContent>
        <TextInput
          source={`${source}.label`}
          label="datalayer.form.reporting.config-label"
          validate={required()}
          fullWidth
        />

        <Typography variant="subtitle1" style={{ marginTop: 16, marginBottom: 8 }}>
          {translate('datalayer.form.reporting.fields')}
        </Typography>

        <ArrayInput source={`${source}.report_fields`} label="">
          <SimpleFormIterator disableReordering>
            <ReportFieldItem />
          </SimpleFormIterator>
        </ArrayInput>
      </CardContent>
    </Card>
  );
};

export default ReportConfigItem;
