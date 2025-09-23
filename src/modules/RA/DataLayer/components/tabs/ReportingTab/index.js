import React from 'react';
import { useTranslate } from 'react-admin';
import { useField } from 'react-final-form';

import Typography from '@material-ui/core/Typography';
import Placeholder from '../../../../../../components/Placeholder';

import ReportConfigField from './ReportConfigField';

const validateReportConfigs = data => {
  if (!data || !Array.isArray(data)) {
    return undefined;
  }

  const hasInvalidConfig = data.some(config => {
    if (!config || !config.label || !config.label.trim()) {
      return true;
    }
    if (
      config.report_fields &&
      config.report_fields.some(field => !field || !field.sourceFieldId)
    ) {
      return true;
    }
    return false;
  });

  if (hasInvalidConfig) {
    return 'datalayer.form.reporting.config-in-error';
  }
  return undefined;
};

const ReportingTabContent = props => {
  const {
    input: { value: source },
  } = useField('source');
  const translate = useTranslate();

  if (!source) {
    return (
      <Placeholder>
        <Typography variant="h5" component="h2">
          {translate('datalayer.form.reporting.no-source')}
        </Typography>
      </Placeholder>
    );
  }

  return (
    <ReportConfigField
      source="report_configs"
      label="datalayer.form.reporting.configs"
      validate={validateReportConfigs}
      {...props}
    />
  );
};

export default ReportingTabContent;
