import React from 'react';
import Api from '@terralego/core/modules/Api';

import {
  AutocompleteArrayInput,
  Datagrid,
  DateField,
  DisabledInput,
  EditButton,
  FormTab,
  ImageField,
  LinearProgress,
  LongTextInput,
  NumberInput,
  ReferenceArrayField,
  SelectInput,
  TabbedForm,
  TextField,
  TextInput,
} from 'react-admin';
import RichTextInput from 'ra-input-rich-text';
import { RES_PICTURE } from '../../ra-modules';
import MapPointInput from '../../../../components/react-admin/MapPointInput';

const ViewpointFields = ({ edit = false, translate: t, ...props }) => {
  const [remoteChoices, setRemoteChoices] = React.useState([]);
  const [waiting, setWaiting] = React.useState(false);

  const getRemoteData = async () => {
    setWaiting(true);

    const { themes, cities } = await Api.request('/viewpoints/filters/');

    setRemoteChoices({
      themes: themes.map(theme => ({ id: theme, name: theme })),
      cities: cities.map(city => ({ id: city, name: city })),
    });

    setWaiting(false);
  };

  React.useEffect(() => {
    if (edit) {
      getRemoteData();
    }
  }, [edit]);

  return (
    <TabbedForm {...props}>
      <FormTab label="resources.viewpoint.tabs.general">
        {edit && <DisabledInput source="id" />}
        <TextInput source="label" />

        <TextInput source="address" />

        {waiting && <><LinearProgress /></>}
        {!waiting && (
          <SelectInput
            translateChoice={false}
            source="properties.commune"
            choices={remoteChoices.cities}
          />
        )}

        <NumberInput source="geometry.coordinates[0]" />
        <NumberInput source="geometry.coordinates[1]" />

        <MapPointInput source="geometry.coordinates" />
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

        {waiting && <><LinearProgress /></>}
        {!waiting && (
          <AutocompleteArrayInput
            translateChoice={false}
            source="properties.themes"
            choices={remoteChoices.themes}
          />
        )}

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
};

export default ViewpointFields;
