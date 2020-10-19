import React from 'react';
import {
  TextInput,
  SelectInput,
  translate,
  required,
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

    <TextInput source="db_host" type="text" label="datasource.form.request.host-server" />
    <TextInput source="db_port" type="number" label="datasource.form.request.host-port" />
    <TextInput source="db_name" type="text" label="datasource.form.request.database-name" />
    <TextInput source="db_username" type="text" label="datasource.form.request.user-name" />
    <TextInput source="db_password" type="password" label="datasource.form.request.user-password" />

    <TextInput
      multiline
      source="query"
      type="text"
      label="datasource.form.request.query"
      helperText={t('datasource.form.request.query-help')}
      style={{ width: '100%' }}
    />

    <TextInput
      source="geom_field"
      type="text"
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
      type="text"
      source="id_field"
      label="datasource.form.uid-field"
      validate={required()}
      helperText={t('datasource.form.uid-field-help')}
      fullWidth
    />
  </FieldGroup>
);

export default translate(DataSourceDbFields);
