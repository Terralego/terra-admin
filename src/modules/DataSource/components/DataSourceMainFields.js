import React from 'react';
import {
  TextInput,
  LongTextInput,
  SelectInput,
  translate as translateRA,
} from 'react-admin';


import FieldGroup from '../../../components/react-admin/FieldGroup';

const required = (message = 'Required') => value => (value ? undefined : message);
const defaultRequired = required();

const DataSourceMainFields = ({ translate, ...props }) => (
  <FieldGroup {...props}>
    <TextInput
      source="name"
      validate={defaultRequired}
      type="text"
      label="datasource.form.name"
    />
    <LongTextInput source="description" defaultValue="" label="datasource.form.description" />

    <SelectInput
      source="geom_type"
      label="datasource.form.geometry"
      validate={defaultRequired}
      choices={[
        { id: '0', name: 'Point' },
        { id: 1, name: 'LineString' },
        { id: 2, name: 'LinearRi' },
        { id: 3, name: 'Polygon' },
        { id: 4, name: 'MultiPoint' },
        { id: 5, name: 'MultiLineString' },
        { id: 6, name: 'MultiPolygon' },
        { id: 7, name: 'GeometryCollection' },
      ]}
    />
  </FieldGroup>
);

export default translateRA(DataSourceMainFields);
