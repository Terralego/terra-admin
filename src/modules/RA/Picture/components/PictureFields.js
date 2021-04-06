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
  ReferenceField,
  TextField,
  SelectField,
} from 'react-admin';

import { withStyles } from '@material-ui/core/styles';

import { RES_VIEWPOINT, RES_USER } from '../../ra-modules';
import MapPointInput from '../../../../components/react-admin/MapPointInput';
import compose from '../../../../utils/compose';
import { withMapConfig } from '../../../../hoc/withAppSettings';
import CustomToolbar from './CustomToolbar';
import TimeInput from '../../../../components/react-admin/TimeInput';

import useUserSettings from '../../../../hooks/useUserSettings';
import { stateChoices } from '../utils';
import Condition from '../../../../components/react-admin/Condition';
import UserNameField from '../../User/components/UserNameField';

const styles = {
  inline: {
    display: 'inline-block',
    marginRight: '1em',
  },
};

const weatherConditions = [
  { id: 'good_weather', name: 'ra.pictures.weather.good_weather' },
  { id: 'lightly_cloudy', name: 'ra.pictures.weather.lightly_cloudy' },
  { id: 'partialy_cloudy', name: 'ra.pictures.weather.partialy_cloudy' },
  { id: 'cloudy', name: 'ra.pictures.weather.cloudy' },
];

const Br = () => <br />;

const PictureFields = ({ edit, classes, mapConfig, location, ...props }) => {
  const { hasPermission } = useUserSettings();

  return (
    <TabbedForm {...props} toolbar={<CustomToolbar />} initialValues={{ state: 'draft' }}>
      <FormTab label="resources.picture.tabs.metadata">
        {hasPermission('can_manage_pictures') && (
          <ReferenceInput
            source="viewpoint"
            reference={RES_VIEWPOINT}
            formClassName={classes.inline}
            validate={required()}
          >
            <SelectInput optionText="label" />
          </ReferenceInput>
        )}
        {!hasPermission('can_manage_pictures') && hasPermission('can_add_pictures') && (
          <ReferenceField
            source="viewpoint"
            reference={RES_VIEWPOINT}
            formClassName={classes.inline}
          >
            <TextField source="label" />
          </ReferenceField>
        )}
        <Condition when="state" is="accepted">
          {edit && <TextField source="identifier" formClassName={classes.inline} />}
        </Condition>

        {edit && (
          <SelectField source="state" choices={stateChoices} formClassName={classes.inline} />
        )}

        <Br />

        <DateInput source="date" formClassName={classes.inline} />
        <TimeInput
          source="date"
          label="resources.picture.fields.time"
          formClassName={classes.inline}
        />

        <Br />

        {hasPermission('can_manage_users') && !edit && (
          <ReferenceInput
            source="owner_id"
            reference={RES_USER}
            formClassName={classes.inline}
            validate={required()}
            disable={edit}
          >
            <SelectInput
              optionText={record => UserNameField({ record })}
              label="resources.picture.fields.owner_id"
            />
          </ReferenceInput>
        )}

        {hasPermission('can_manage_users') && edit && (
          <TextInput
            disabled
            source="owner.email"
            formClassName={classes.inline}
            label="resources.picture.fields.owner_id"
          />
        )}

        <Br />

        <TextInput source="properties.camera_brand" formClassName={classes.inline} />
        <TextInput source="properties.camera_model" formClassName={classes.inline} />
        <SelectInput source="properties.meteo" choices={weatherConditions} />
        <Br />

        <TextInput multiline source="properties.observations" fullWidth />

        <Br />

        <ImageInput source="file" accept="image/*">
          <ImageField source="thumbnail" />
        </ImageInput>
      </FormTab>

      <FormTab label="resources.picture.tabs.repeat" path="repeat">
        <Br />

        <TextInput source="properties.altitude" formClassName={classes.inline} />
        <TextInput source="properties.hauteur" formClassName={classes.inline} />
        <TextInput source="properties.orientation" formClassName={classes.inline} />

        <Br />

        <TextInput source="properties.focale_35mm" formClassName={classes.inline} />
        <TextInput source="properties.focale_objectif" formClassName={classes.inline} />

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
};

PictureFields.propTypes = {
  edit: PropTypes.bool,
};

PictureFields.defaultProps = {
  edit: false,
};

export default compose(withMapConfig, withStyles(styles))(PictureFields);
