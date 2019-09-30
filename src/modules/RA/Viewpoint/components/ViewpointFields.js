import React from 'react';
import PropTypes from 'prop-types';
import Api from '@terralego/core/modules/Api';

import {
  AutocompleteArrayInput,
  Datagrid,
  DateField,
  DisabledInput,
  EditButton,
  FileField,
  FormTab,
  ImageField,
  LinearProgress,
  LongTextInput,
  NumberField,
  NumberInput,
  ReferenceArrayField,
  SelectInput,
  TabbedForm,
  TextField,
  TextInput,
} from 'react-admin';
import RichTextInput from 'ra-input-rich-text';

import { withStyles } from '@material-ui/core/styles'; // eslint-disable-line import/no-extraneous-dependencies

import { RES_PICTURE } from '../../ra-modules';
import MapPointInput from '../../../../components/react-admin/MapPointInput';
import compose from '../../../../utils/compose';

const styles = {
  inline: {
    display: 'inline-block',
    marginRight: '1em',
  },
};

const Br = () => <br />;

const ViewpointFields = ({ edit, classes, ...props }) => {
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
        <TextInput source="label" formClassName={classes.inline} />
        {edit && <DisabledInput source="id" formClassName={classes.inline} />}

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
          source="geometry.coordinates[1]"
          formClassName={classes.inline}
        />
        <NumberInput
          source="geometry.coordinates[0]"
          formClassName={classes.inline}
        />

        <MapPointInput source="geometry.coordinates" />
      </FormTab>

      <FormTab label="resources.viewpoint.tabs.repeat" path="repeat">
        <NumberField
          source="geometry.coordinates[1]"
          options={{ maximumFractionDigits: 6 }}
          formClassName={classes.inline}
        />
        <NumberField
          source="geometry.coordinates[0]"
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
        <LongTextInput source="properties.note" rows={4} rowsMax={30} />
      </FormTab>

      <FormTab label="resources.viewpoint.tabs.landscape" path="landscape">
        <RichTextInput source="properties.paysage" />
        <RichTextInput source="properties.dynamiques" />
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

        <FileField source="related" src="document" title="key" />
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

ViewpointFields.propTypes = {
  edit: PropTypes.bool,
};

ViewpointFields.defaultProps = {
  edit: false,
};

export default compose(
  withStyles(styles),
)(ViewpointFields);
