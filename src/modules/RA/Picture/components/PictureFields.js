import React from 'react';
import PropTypes from 'prop-types';

import {
  DateTimeInput,
  DisabledInput,
  FormTab,
  ImageField,
  NumberInput,
  TabbedForm,
  TextInput,
} from 'react-admin';

import { withStyles } from '@material-ui/core/styles'; // eslint-disable-line import/no-extraneous-dependencies

import MapPointInput from '../../../../components/react-admin/MapPointInput';
import compose from '../../../../utils/compose';

const styles = {
  inline: {
    display: 'inline-block',
    marginRight: '1em',
  },
};

const Br = () => <br />;

const PictureFields = ({ edit, classes, ...props }) => (
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

      <TextInput multiline source="properties.observations" />

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
