import React from 'react';
import PropTypes from 'prop-types';
import Api from '@terralego/core/modules/Api';

import {
  ArrayInput,
  AutocompleteArrayInput,
  FormTab,
  ImageField,
  ImageInput,
  LinearProgress,
  LongTextInput,
  NumberField,
  NumberInput,
  ReferenceArrayField,
  SelectInput,
  SimpleFormIterator,
  TabbedForm,
  TextInput,
} from 'react-admin';
import RichTextInput from 'ra-input-rich-text';

import { withStyles } from '@material-ui/core/styles'; // eslint-disable-line import/no-extraneous-dependencies

import { RES_PICTURE } from '../../ra-modules';
import MapPointInput from '../../../../components/react-admin/MapPointInput';
import compose from '../../../../utils/compose';
import { withMapConfig } from '../../../../hoc/withAppSettings';
import GridListPictures from './GridListPictures';

const styles = {
  inline: {
    display: 'inline-block',
    marginRight: '1em',
  },
};

const Br = () => <br />;

const ViewpointFields = ({
  edit,
  classes,
  mapConfig,
  record,
  ...props
}) => {
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
      record={record}
      {...props}
    >
      <FormTab label="resources.viewpoint.tabs.general">
        <TextInput source="label" formClassName={classes.inline} />
        <TextInput source="properties.index" formClassName={classes.inline} />

        <Br />

        <TextInput source="properties.voie" />

        {waiting && (
          <>
            <LinearProgress />
          </>
        )}
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

          <TextInput
            source="properties.altitude"
            formClassName={classes.inline}
          />
          <TextInput
            source="properties.hauteur"
            formClassName={classes.inline}
          />
          <TextInput
            source="properties.orientation"
            formClassName={classes.inline}
          />

          <Br />

          <TextInput
            source="properties.focale_35mm"
            formClassName={classes.inline}
          />
          <TextInput
            source="properties.focale_objectif"
            formClassName={classes.inline}
          />

          <Br />

          <SelectInput source="properties.frequency" choices={[]} formClassName={classes.inline} />
          <SelectInput source="properties.difficulty" choices={[]} formClassName={classes.inline} />
          <LongTextInput source="properties.rephotographie" rows={4} rowsMax={30} />

          <ArrayInput source="related">
            <SimpleFormIterator>
              <SelectInput
                label="resources.viewpoint.fields.related.key"
                source="key"
                choices={[
                  { id: 'croquis', name: 'Croquis' },
                  { id: 'emplacement', name: 'Emplacement' },
                ]}
              />
              <ImageInput label="resources.viewpoint.fields.related.document">
                <ImageField source="document" />
              </ImageInput>
            </SimpleFormIterator>
          </ArrayInput>
        </FormTab>
      )}
      {edit && (
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
      </FormTab>
      )}

      {edit && (
        <FormTab label="resources.viewpoint.tabs.pictures" path="pictures">
          <ReferenceArrayField
            source="picture_ids"
            reference={RES_PICTURE}
            fullWidth
          >
            <GridListPictures viewpointId={record.id} />
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
