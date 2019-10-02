import React from 'react';
import PropTypes from 'prop-types';
import Api from '@terralego/core/modules/Api';

import {
  AutocompleteArrayInput,
  Datagrid,
  DateField,
  EditButton,
  FileField,
  FormTab,
  ImageField,
  LinearProgress,
  NumberField,
  NumberInput,
  ReferenceArrayField,
  SelectInput,
  TabbedForm,
  TextField,
  TextInput,
  ReferenceField,
} from 'react-admin';
import RichTextInput from 'ra-input-rich-text';

import { withStyles } from '@material-ui/core/styles'; // eslint-disable-line import/no-extraneous-dependencies

import { RES_PICTURE } from '../../ra-modules';
import MapPointInput from '../../../../components/react-admin/MapPointInput';
import compose from '../../../../utils/compose';
import { withMapConfig } from '../../../../hoc/withAppSettings';

const styles = {
  inline: {
    display: 'inline-block',
    marginRight: '1em',
  },
};

const Br = () => <br />;

const ViewpointFields = ({ edit, classes, mapConfig, ...props }) => {
  const [remoteChoices, setRemoteChoices] = React.useState([]);
  const [waiting, setWaiting] = React.useState(false);

  const getRemoteData = async () => {
    setWaiting(true);

    const { themes, cities } = await Api.request('viewpoints/filters/');

    setRemoteChoices({
      themes: themes.map(theme => ({ id: theme, name: theme })),
      cities: cities.map(city => ({ id: city, name: city })),
    });

    setWaiting(false);
  };

  React.useEffect(() => {
    getRemoteData();
  }, []);

  return (
    <TabbedForm
      defaultValue={{
        point: {
          coordinates: undefined,
          type: 'Point',
        },
      }}
      {...props}
    >
      <FormTab label="resources.viewpoint.tabs.general">
        <TextInput source="label" formClassName={classes.inline} />
        <TextInput source="properties.index" formClassName={classes.inline} />

        <Br />

        <TextInput source="properties.voie" />

        {waiting && <><LinearProgress /></>}
        {!waiting && (
          <SelectInput
            translateChoice={false}
            source="properties.commune"
            choices={remoteChoices.cities}
          />
        )}

        <Br />

        <NumberInput
          source="point.coordinates[1]"
          formClassName={classes.inline}
        />
        <NumberInput
          source="point.coordinates[0]"
          formClassName={classes.inline}
        />

        <MapPointInput source="point.coordinates" center={mapConfig.center} />
      </FormTab>

      {edit && (
      <FormTab label="resources.viewpoint.tabs.repeat" path="repeat">
        <NumberField
          source="point.coordinates[1]"
          options={{ maximumFractionDigits: 6 }}
          formClassName={classes.inline}
        />
        <NumberField
          source="point.coordinates[0]"
          options={{ maximumFractionDigits: 6 }}
          formClassName={classes.inline}
        />

        <Br />

        <TextInput source="properties.altitude" formClassName={classes.inline} />
        <TextInput source="properties.hauteur" formClassName={classes.inline} />
        <TextInput source="properties.orientation" formClassName={classes.inline} />

        <Br />

        <TextInput source="properties.focale_35mm" formClassName={classes.inline} />
        <TextInput source="properties.focale_objectif" formClassName={classes.inline} />

        <Br />

        <SelectInput source="properties.frequency" choices={[]} formClassName={classes.inline} />
        <SelectInput source="properties.difficulty" choices={[]} formClassName={classes.inline} />
        <TextInput multiline source="properties.note" rows={4} rowsMax={30} />
      </FormTab>
      )}
      {edit && (
      <FormTab label="resources.viewpoint.tabs.landscape" path="landscape">
        <RichTextInput source="properties.paysage" />
        <RichTextInput source="properties.dynamiques" />
        <TextInput multiline source="properties.issues" />
        <TextInput multiline source="properties.observations" />
        <TextInput multiline source="properties.historial-data" />
        <TextInput multiline source="properties.cultural-references" />

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

        <FileField source="related" src="document" title="key" />
      </FormTab>
      )}

      {edit && (
      <FormTab label="resources.viewpoint.tabs.pictures" path="pictures">
        <ReferenceArrayField source="picture_ids" reference={RES_PICTURE} fullWidth>
          <Datagrid rowClick="edit">
            {/* Waiting for back-end api to manage it properly */}
            {false && <ReferenceField source="owner_id" reference="users" />}
            <TextField source="properties.meteo" />
            <DateField source="date" />
            <TextField source="state" />
            <ImageField source="file.thumbnail" />
            <EditButton />
          </Datagrid>
        </ReferenceArrayField>
      </FormTab>
      )}
    </TabbedForm>
  );
};

ViewpointFields.propTypes = {
  edit: PropTypes.bool,
};

ViewpointFields.defaultProps = {
  edit: false,
};

export default compose(
  withMapConfig,
  withStyles(styles),
)(ViewpointFields);
