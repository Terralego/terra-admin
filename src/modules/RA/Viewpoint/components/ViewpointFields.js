import React from 'react';
import PropTypes from 'prop-types';
import Api from '@terralego/core/modules/Api';
import mime from 'mime-types';
import get from 'lodash.get';
import { v4 as uuid } from 'uuid';

import {
  minValue,
  number,
  translate,
  ArrayInput,
  AutocompleteArrayInput,
  AutocompleteInput,
  BooleanInput,
  FileField,
  FormTab,
  ImageField,
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
  FileInput,
  useRecordContext,
} from 'react-admin';
import RichTextInput from 'ra-input-rich-text';

import { remove } from 'diacritics';
import { withStyles } from '@material-ui/core/styles';

import { RES_PICTURE, RES_THEME } from '../../ra-modules';

import MapPointInput from '../../../../components/react-admin/MapPointInput';
import compose from '../../../../utils/compose';
import { withMapConfig } from '../../../../hoc/withAppSettings';
import GridListPictures from './GridListPictures';
import { useGetListAllPages } from '../../../../utils/react-admin/hooks';
import useAppSettings from '../../../../hooks/useAppSettings';

import themeRenderer from './themeRenderer';

const styles = {
  inline: {
    display: 'inline-block',
    marginRight: '1em',
  },
};

const Br = () => <br />;

const isRequired = [required()];

const FilePreview = props => {
  const { source } = props;
  const record = useRecordContext(props);
  const sourceValue = get(record, source);
  let isImage = false;

  if (record.rawFile) {
    isImage = (mime.lookup(record.rawFile.name) || []).includes('image');
  } else {
    isImage = (mime.lookup(sourceValue) || []).includes('image');
  }
  if (isImage) {
    return <ImageField {...props} />;
  }

  return <FileField {...props} title="Voir" />;
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
        <TextField source="properties.hauteur" record={pictureRecord} {...rest} />
      </Labeled>
      <Labeled label="resources.viewpoint.fields.properties.orientation">
        <TextField record={pictureRecord} source="properties.orientation" {...rest} />
      </Labeled>
      <Br />
      <Labeled label="resources.viewpoint.fields.properties.focale_35mm">
        <TextField record={pictureRecord} source="properties.focale_35mm" {...rest} />
      </Labeled>
      <Labeled label="resources.viewpoint.fields.properties.focale_objectif">
        <TextField record={pictureRecord} source="properties.focale_objectif" {...rest} />
      </Labeled>
    </>
  );
};

const themeFilter = { field: 'label', order: 'DESC' };

const normalizeText = text => (text ? remove(text.toLowerCase()) : '');

const matchThemeSearch = (filter, choice) =>
  normalizeText(choice.label).includes(normalizeText(filter));

const ViewpointFields = ({ translate: t, edit, classes, mapConfig, record, ...props }) => {
  const { modules:
    {
      OPP: {
        theme_categories: themeCategories = [],
      } = {},
    } = {} } = useAppSettings();

  const [remoteChoices, setRemoteChoices] = React.useState([]);
  const [waiting, setWaiting] = React.useState(false);
  const { data: rawThemes, isLoading } = useGetListAllPages(RES_THEME, 50, themeFilter);


  const categoryMap = React.useMemo(() => themeCategories.reduce(
    (acc, cat) => { acc[cat.id] = cat; return acc; }, {},
  ),
  [themeCategories]);

  const getRemoteData = React.useCallback(async () => {
    setWaiting(true);

    if (isLoading) {
      return;
    }

    const { cities } = await Api.request('viewpoints/filters/');

    setRemoteChoices({
      themes: rawThemes.map(
        theme => ({
          ...theme,
          id: theme.label,
          name: theme.label,
          category: categoryMap[theme.category],
        }),
      ),
      cities: cities.map((city, index) => ({ id: index, name: city })),
    });

    setWaiting(false);
  }, [categoryMap, isLoading, rawThemes]);

  React.useEffect(() => {
    getRemoteData();
  }, [getRemoteData]);

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
          <AutocompleteInput
            source="city"
            choices={remoteChoices.cities}
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
          defaultValue={['', '']}
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
            helperText="resources.viewpoint.fields.frequency_help"
          />

          <Br />

          <BooleanInput source="properties.difficulte" formClassName={classes.inline} />
          <TextInput multiline source="properties.rephotographie" rows={4} rowsMax={30} />

          <ArrayInput source="related_rephotography" fullWidth>
            <SimpleFormIterator>
              <TextInput source="key" defaultValue={`${uuid()}`} style={{ display: 'none' }} disabled />
              <SelectInput
                label="resources.viewpoint.fields.related.type"
                source="properties.type"
                choices={[
                  { id: 'croquis', name: 'Croquis' },
                  { id: 'emplacement', name: 'Emplacement' },
                ]}
                formClassName={classes.inline}
                validate={isRequired}
              />
              <TextInput
                label="resources.viewpoint.fields.related.label"
                source="properties.label"
                formClassName={classes.inline}
              />
              <FileInput source="document">
                <FilePreview source="url" />
              </FileInput>
            </SimpleFormIterator>
          </ArrayInput>
        </FormTab>
      )}
      {edit && (
        <FormTab label="resources.viewpoint.tabs.landscape" path="landscape">
          <RichTextInput source="properties.paysage" />
          <RichTextInput source="properties.dynamiques" />
          <TextInput multiline source="properties.observations" fullWidth />

          {waiting && (
            <>
              <LinearProgress />
            </>
          )}
          {!waiting && remoteChoices.themes && (
            <AutocompleteArrayInput
              translateChoice={false}
              source="themes"
              choices={remoteChoices.themes}
              optionText={themeRenderer}
              matchSuggestion={matchThemeSearch}
            />
          )}

          <ArrayInput source="related_docs" fullWidth>
            <SimpleFormIterator>
              <TextInput source="key" defaultValue={`${uuid()}`} style={{ display: 'none' }} disabled />
              <TextInput source="properties.type" defaultValue="doc" style={{ display: 'none' }} disabled />
              <TextInput
                label="resources.viewpoint.fields.related.label"
                source="properties.label"
                formClassName={classes.inline}
                validate={isRequired}
              />
              <FileInput source="document">
                <FilePreview source="url" />
              </FileInput>
            </SimpleFormIterator>
          </ArrayInput>
        </FormTab>
      )}

      {edit && (
        <FormTab label="resources.viewpoint.tabs.pictures" path="pictures">
          <ReferenceArrayField
            source="picture_ids"
            reference={RES_PICTURE}
            label="resources.viewpoint.fields.pictures"
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

export default compose(translate, withMapConfig, withStyles(styles))(ViewpointFields);
