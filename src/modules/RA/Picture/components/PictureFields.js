import React from 'react';
import PropTypes from 'prop-types';

import {
  DateInput,
  DateTimeInput,
  DisabledInput,
  FormTab,
  ImageField,
  ImageInput,
  LongTextInput,
  NumberInput,
  ReferenceInput,
  SelectInput,
  TabbedForm,
  TextInput,
  required,
} from 'react-admin';

import { withStyles } from '@material-ui/core/styles'; // eslint-disable-line import/no-extraneous-dependencies

import { RES_VIEWPOINT } from '../../ra-modules';
import MapPointInput from '../../../../components/react-admin/MapPointInput';
import compose from '../../../../utils/compose';

const styles = {
  inline: {
    display: 'inline-block',
    marginRight: '1em',
  },
};

const Br = () => <br />;

const PictureFields = ({ edit, classes, mapConfig, ...props }) => (
  <TabbedForm {...props}>
    <FormTab label="resources.picture.tabs.metadata">
      <TextInput source="label" formClassName={classes.inline} />
      <TextInput source="properties.index" formClassName={classes.inline} />
      <DateTimeInput source="date" showTime />

      <br />

      {edit && <DisabledInput source="owner.properties.name" formClassName={classes.inline} />}
      <br />
      <TextInput source="properties.camera_brand" formClassName={classes.inline} />
      <TextInput source="properties.camera_model" formClassName={classes.inline} />
      <TextInput source="properties.focale_35mm" formClassName={classes.inline} />
      <TextInput source="properties.meteo" />

      <Br />

      <LongTextInput source="properties.observations" />

      <Br />

      <ImageField title="properties.index" source="file.full" />
    </FormTab>

    <FormTab label="resources.picture.tabs.repeat" path="repeat">
      <NumberInput
        source="geometry.coordinates[1]"
        formClassName={classes.inline}
      />
      <NumberInput
        source="geometry.coordinates[0]"
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
      <MapPointInput source="geometry.coordinates" />
    </FormTab>

    {/*  */}
    {/*  */}

    <FormTab label="jpa.general">
      <ReferenceInput source="viewpoint" reference={RES_VIEWPOINT}>
        <SelectInput optionText="label" />
      </ReferenceInput>
      <TextInput source="properties.index" />
      <TextInput source="remarks" validate={required()} />
      <DateInput source="date" />

      <ImageInput source="file" accept="image/*">
        <ImageField source="thumbnail" />
      </ImageInput>
    </FormTab>

    <FormTab label="jpa.details">
      <TextInput source="properties.meteo" />
      <TextInput source="properties.hauteur" />
      <TextInput source="properties.altitude" />
      <TextInput source="properties.focale_35mm" />
      <TextInput source="properties.orientation" />
      <TextInput source="properties.camera_brand" />
      <TextInput source="properties.camera_model" />
      <TextInput source="properties.focale_objectif" />
      <TextInput source="properties.photographer" />

      {/* <ReferenceInput source="properties.photographer" reference={RES_USER}>
        <SelectInput optionText="email" />
      </ReferenceInput> */}
    </FormTab>
  </TabbedForm>
);

PictureFields.propTypes = {
  edit: PropTypes.bool,
};

PictureFields.defaultProps = {
  edit: false,
};

export default compose(
  withStyles(styles),
)(PictureFields);
