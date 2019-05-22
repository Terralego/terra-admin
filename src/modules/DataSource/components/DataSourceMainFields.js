import React from 'react';
import {
  TextInput,
  LongTextInput,
  FileInput,
  FileField,
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

import { required } from '../../../utils/react-admin/validate';

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

    <RadioButtonGroupInput
      source="geom_type"
      label="datasource.form.geometry"
      validate={defaultRequired}
      choices={[
        { id: 'point', name: 'Point' },
        { id: 'line', name: 'Line' },
        { id: 'polygon', name: 'Polygon' },
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
