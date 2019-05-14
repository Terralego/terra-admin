import React from 'react';
import {
  TextInput, LongTextInput,
  FileInput, FileField,
  RadioButtonGroupInput,
  FormDataConsumer,
} from 'react-admin';

import FieldGroup from '../../../components/react-admin/FieldGroup';
import DbFields from './DbFields';

const required = (message = 'Required') => value => (value ? undefined : message);
const defaultRequired = required();

const DataSourceMainFields = props => (
  <FieldGroup {...props}>
    <TextInput
      source="name"
      validate={defaultRequired}
      type="text"
    />
    <LongTextInput source="description" defaultValue="" />

    <RadioButtonGroupInput
      source="geom_type"
      validate={defaultRequired}
      choices={[
        { id: 'point', name: 'Point' },
        { id: 'line', name: 'Line' },
        { id: 'polygon', name: 'Polygon' },
      ]}
    />

    <RadioButtonGroupInput
      source="_type"
      validate={defaultRequired}
      choices={[
        { id: 'GeoJSONSourceModel', name: 'Import file' },
        { id: 'PostGISSourceModel', name: 'SQL query' },
      ]}
    />

    <FormDataConsumer>
      {({ formData: { _type: type } = {}, ...rest }) =>
        type === 'GeoJSONSourceModel' && (
          <FileInput
            source="files"
            label="Related files"
            multiple={false}
            placeholder={<p>Drop your file here (geoJson or SHP)</p>}
            {...rest}
          >
            <FileField source="file_data" title="title" />
          </FileInput>
        )}
    </FormDataConsumer>

    <FormDataConsumer>
      {({ formData: { _type: type } = {}, ...rest }) => type === 'PostGISSourceModel' && <DbFields {...rest} />}
    </FormDataConsumer>
  </FieldGroup>
);

export default DataSourceMainFields;
