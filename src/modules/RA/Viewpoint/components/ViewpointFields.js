import React from 'react';

import {
  Datagrid,
  DateField,
  DisabledInput,
  EditButton,
  FormTab,
  ImageField,
  LongTextInput,
  ReferenceArrayField,
  SelectInput,
  TabbedForm,
  TextField,
  TextInput,
} from 'react-admin';
import RichTextInput from 'ra-input-rich-text';
import { RES_PICTURE } from '../../ra-modules';

const ViewpointFields = ({ edit = false, translate: t, ...props }) => (
  <TabbedForm {...props}>
    <FormTab label="resources.viewpoint.tabs.general">
      {edit && <DisabledInput source="id" />}
      <TextInput source="label" />

      <TextInput source="address" />
      <SelectInput source="city_id" choices={[]} />

      <TextInput source="geometry.coordinates" />
    </FormTab>

    <FormTab label="resources.viewpoint.tabs.repeat" path="repeat">
      <TextInput source="properties.altitude" />
      <TextInput source="properties.hauteur" />
      <TextInput source="properties.orientation" />
      <TextInput source="properties.focale_35mm" />
      <TextInput source="properties.focale_objectif" />
      <SelectInput source="properties.frequency" choices={[]} />
      <SelectInput source="properties.difficulty" choices={[]} />
      <TextInput source="properties.note" />
    </FormTab>

    <FormTab label="resources.viewpoint.tabs.landscape" path="landscape">
      <RichTextInput source="properties.description" />
      <LongTextInput source="properties.current-progressions" />
      <LongTextInput source="properties.issues" />
      <LongTextInput source="properties.observations" />
      <LongTextInput source="properties.historial-data" />
      <LongTextInput source="properties.cultural-references" />
      <TextInput source="properties.theme_ids" /* Should be converted to referenceInput to RES_THEME */ />
      <TextInput source="properties.keywords" />
      <TextInput source="properties.landscape-entities" />
      <TextInput source="properties.related-elements" />
    </FormTab>

    <FormTab label="resources.viewpoint.tabs.pictures" path="pictures">
      <ReferenceArrayField source="picture_ids" reference={RES_PICTURE} fullWidth>
        <Datagrid rowClick="edit">
          <TextField source="owner" />
          <TextField source="properties.meteo" />
          <DateField source="date" />
          <TextField source="state" />
          <ImageField source="file" />
          <EditButton />
        </Datagrid>
      </ReferenceArrayField>
    </FormTab>
  </TabbedForm>
);

export default ViewpointFields;
