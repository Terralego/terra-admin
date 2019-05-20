import React from 'react';
import {
  TextInput,
  LongTextInput,
  FileInput,
  FileField,
  SelectInput,
  RadioButtonGroupInput,
  FormDataConsumer,
  translate as translateRA,
} from 'react-admin';

import {
  GEOJSON,
  SQL,
  sourceTypeChoices,
} from '../DataSource';

import FieldGroup from '../../../components/react-admin/FieldGroup';
import DbFields from './DbFields';

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

    <RadioButtonGroupInput
      source="_type"
      label="datasource.form.type"
      validate={defaultRequired}
      choices={sourceTypeChoices}
    />

    <FormDataConsumer>
      {({ formData: { _type: type } = {}, ...rest }) =>
        type === GEOJSON && (
          <FileInput
            source="files"
            label="datasource.form.file.related-files"
            multiple={false}
            placeholder={translate('datasource.form.file.placeholder')}
            {...rest}
          >
            <FileField source="file_data" title="title" />
          </FileInput>
        )}
    </FormDataConsumer>

    <FormDataConsumer>
      {({ formData: { _type: type } = {}, ...rest }) => type === SQL && <DbFields {...rest} />}
    </FormDataConsumer>
  </FieldGroup>
);

export default translateRA(DataSourceMainFields);
