import React from 'react';
import PropTypes from 'prop-types';
import Api from '@terralego/core/modules/Api';
import mime from 'mime-types';

import {
  minValue,
  number,
  translate,
  ArrayInput,
  AutocompleteArrayInput,
  BooleanInput,
  FileField,
  FileInput as RAFileInput,
  FormTab,
  ImageField,
  ImageInput,
  Labeled,
  LinearProgress,
  NumberField,
  NumberInput,
  ReferenceArrayField,
  required,
  SimpleFormIterator,
  TabbedForm,
  TextField,
  SelectInput,
  TextInput,
} from 'react-admin';
import RichTextInput from 'ra-input-rich-text';


import { withStyles } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';

import { RES_PICTURE } from '../../ra-modules';

import MapPointInput from '../../../../components/react-admin/MapPointInput';
import FreeAutocompleteInput from '../../../../components/react-admin/FreeAutocompleteInput';
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

const SmartFileInput = props => {
  const {
    record: { document },
  } = props;
  const isImage = mime.lookup(document).includes('image');
  const InputComponent = isImage ? ImageInput : RAFileInput;
  const FieldComponent = isImage ? ImageField : FileField;
  return (
    <InputComponent {...props}>
      <FieldComponent source="document" title="voir le fichier" target="_blank" />
    </InputComponent>
  );
};

const PictureRephotography = ({ record, ...rest }) => {
  if (!record || !record.pictures || !record.pictures.length) {
    return null;
  }
  const pictureRecord = record.pictures[record.pictures.length - 1];
  return (
    <>
      <Labeled label="resources.viewpoint.fields.properties.altitude">
        <TextField
          label="resources.viewpoint.fields.properties.altitude"
          source="properties.altitude"
          record={pictureRecord}
          {...rest}
        />
      </Labeled>
      <Labeled label="resources.viewpoint.fields.properties.hauteur">
        <TextField
          source="properties.hauteur"
          record={pictureRecord}
          {...rest}
        />
      </Labeled>
      <Labeled label="resources.viewpoint.fields.properties.orientation">
        <TextField
          record={pictureRecord}
          source="properties.orientation"
          {...rest}
        />
      </Labeled>
      <Br />
      <Labeled label="resources.viewpoint.fields.properties.focale_35mm">
        <TextField
          record={pictureRecord}
          source="properties.focale_35mm"
          {...rest}
        />
      </Labeled>
      <Labeled label="resources.viewpoint.fields.properties.focale_objectif">
        <TextField
          record={pictureRecord}
          source="properties.focale_objectif"
          {...rest}
        />
      </Labeled>
    </>
  );
};

const ViewpointFields = ({
  translate: t,
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
      cities,
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
        <BooleanInput source="active" />
        <TextInput source="label" formClassName={classes.inline} />
        {edit && <TextInput source="id" formClassName={classes.inline} disabled />}

        <Br />

        <TextInput source="properties.voie" />

        {waiting && (
          <>
            <LinearProgress />
          </>
        )}
        {!waiting && (
          <FreeAutocompleteInput
            choices={remoteChoices.cities}
            source="city"
            label="resources.viewpoint.fields.city"
            validate={required()}
          />
        )}

        <NumberInput
          source="point.coordinates[1]"
          formClassName={classes.inline}
          defaultValue={mapConfig.center[1]}
        />
        <NumberInput
          source="point.coordinates[0]"
          formClassName={classes.inline}
          defaultValue={mapConfig.center[0]}
        />

        <MapPointInput
          source="point.coordinates"
          center={mapConfig.center}
          style={{ width: '50%' }}
        />
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

          <PictureRephotography />

          <Br />

          <TextInput
            source="properties.frequence"
            validate={[number(), minValue(1)]}
            formClassName={classes.inline}
            options={{
              InputProps: {
                endAdornment: (
                  <InputAdornment position="end">
                    {t('resources.viewpoint.fields.properties.frequence.suffix')}
                  </InputAdornment>
                ),
              },
            }}
          />
          <BooleanInput source="properties.difficulte" formClassName={classes.inline} />
          <TextInput multiline source="properties.rephotographie" rows={4} rowsMax={30} />

          <ArrayInput source="related" fullWidth>
            <SimpleFormIterator>
              <SelectInput
                label="resources.viewpoint.fields.related.key"
                source="key"
                choices={[
                  { id: 'croquis', name: 'Croquis' },
                  { id: 'emplacement', name: 'Emplacement' },
                ]}
                formClassName={classes.inline}
              />
              <TextInput
                label="resources.viewpoint.fields.related.label"
                source="properties.label"
                formClassName={classes.inline}
              />
              <SmartFileInput label="resources.viewpoint.fields.related.document" />
            </SimpleFormIterator>
          </ArrayInput>
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

          {waiting && (
            <>
              <LinearProgress />
            </>
          )}
          {!waiting && (
            <AutocompleteArrayInput
              translateChoice={false}
              source="themes"
              choices={remoteChoices.themes}
            />
          )}

          <TextInput source="properties.keywords" />
          <TextInput source="properties.landscape-entities" />
        </FormTab>
      )}

      {edit && (
        <FormTab label="resources.viewpoint.tabs.pictures" path="pictures">
          <ReferenceArrayField source="picture_ids" reference={RES_PICTURE} label="resources.viewpoint.fields.pictures" fullWidth>
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
  translate,
  withMapConfig,
  withStyles(styles),
)(ViewpointFields);
