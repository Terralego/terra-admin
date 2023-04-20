import React from 'react';
import {
  TextInput,
  SelectInput,
  translate,
  required,
  PasswordInput,
  NumberInput,
} from 'react-admin';

import { geomTypeChoices } from '..';
import FieldGroup from '../../../../components/react-admin/FieldGroup';

const DataSourceDbFields = ({ translate: t, ...props }) => (
  <FieldGroup {...props}>
    <SelectInput
      source="geom_type"
      label="datasource.form.geometry"
      validate={[required()]}
      choices={geomTypeChoices}
      format={v => `${v}`}
      parse={v => +v}
    />

    <TextInput source="db_host" label="datasource.form.request.host-server" autoComplete="off" />
    <NumberInput source="db_port" label="datasource.form.request.host-port" autoComplete="off" />
    <TextInput source="db_name" label="datasource.form.request.database-name" autoComplete="off" />
    <TextInput source="db_username" label="datasource.form.request.user-name" autoComplete="off" />
    <PasswordInput source="db_password" label="datasource.form.request.user-password" autoComplete="off" />

    <TextInput
      multiline
      source="query"
      label="datasource.form.request.query"
      helperText={t('datasource.form.request.query-help')}
      style={{ width: '100%' }}
    />

    <TextInput
      source="geom_field"
      label="datasource.form.geom-field"
      helperText={t('datasource.form.geom-field-help')}
    />
    <SelectInput
      source="refresh"
      label="datasource.form.request.refresh.name"
      choices={[
        { id: -1, name: 'datasource.form.request.refresh.never' },
        { id: 60, name: 'datasource.form.request.refresh.hourly' },
        { id: (60 * 24), name: 'datasource.form.request.refresh.daily' },
        { id: (60 * 24 * 7), name: 'datasource.form.request.refresh.weekly' },
        { id: (60 * 24 * 30), name: 'datasource.form.request.refresh.monthly' },
      ]}
    />

    <TextInput
      source="id_field"
      label="datasource.form.uid-field"
      validate={required()}
      helperText={t('datasource.form.uid-field-help')}
      fullWidth
    />
  </FieldGroup>
);

export default translate(DataSourceDbFields);
