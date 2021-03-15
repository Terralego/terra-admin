import React from 'react';
import PropTypes from 'prop-types';

import {
  DateInput,
  FormTab,
  ImageField,
  ImageInput,
  NumberInput,
  ReferenceInput,
  SelectInput,
  TabbedForm,
  TextInput,
  required,
} from 'react-admin';

import { withStyles } from '@material-ui/core/styles';

import { RES_VIEWPOINT } from '../../ra-modules';
import MapPointInput from '../../../../components/react-admin/MapPointInput';
import compose from '../../../../utils/compose';
import { withMapConfig } from '../../../../hoc/withAppSettings';
import CustomToolbar from '../../../../components/react-admin/CustomToolbar';
import TimeInput from '../../../../components/react-admin/TimeInput';

const styles = {
  inline: {
    display: 'inline-block',
    marginRight: '1em',
  },
};

const Br = () => <br />;

const PictureFields = ({
  edit,
  classes,
  mapConfig,
  location,
  ...props
}) => (
  <TabbedForm
    {...props}
    toolbar={<CustomToolbar />}
  >
    <FormTab label="resources.picture.tabs.metadata">
      <ReferenceInput
        source="viewpoint"
        reference={RES_VIEWPOINT}
        formClassName={classes.inline}
        validate={required()}
      >
        <SelectInput optionText="label" />
      </ReferenceInput>
      <TextInput source="identifier" formClassName={classes.inline} disabled />

      <Br />

      <DateInput source="date" formClassName={classes.inline} />
      <TimeInput source="date" label="resources.picture.fields.time" formClassName={classes.inline} />

      <Br />

      {edit && (
        <TextInput
          disabled
          source="owner.properties.name"
          formClassName={classes.inline}
        />
      )}

      <Br />

      <TextInput
        source="properties.camera_brand"
        formClassName={classes.inline}
      />
      <TextInput
        source="properties.camera_model"
        formClassName={classes.inline}
      />
      <TextInput source="properties.meteo" />
      <Br />

      <TextInput multiline source="properties.observations" />

      <Br />

      <ImageInput source="file" accept="image/*">
        <ImageField source="thumbnail" />
      </ImageInput>
    </FormTab>

    <FormTab label="resources.picture.tabs.repeat" path="repeat">
      <Br />

      <TextInput source="properties.altitude" formClassName={classes.inline} />
      <TextInput source="properties.hauteur" formClassName={classes.inline} />
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

      <NumberInput
        source="properties.geometry.coordinates[1]"
        formClassName={classes.inline}
        defaultValue={mapConfig.center[1]}
      />
      <NumberInput
        source="properties.geometry.coordinates[0]"
        formClassName={classes.inline}
        defaultValue={mapConfig.center[0]}
      />

      <MapPointInput
        source="properties.geometry.coordinates"
        center={mapConfig.center}
        style={{ width: '50%' }}
      />
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
  withMapConfig,
  withStyles(styles),
)(PictureFields);
