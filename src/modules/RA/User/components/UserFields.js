import React from 'react';
import {
  TextInput,
  SimpleForm,
  BooleanInput,
  ReferenceArrayInput,
  SelectArrayInput,
  useTranslate,
} from 'react-admin';

import { makeStyles } from '@material-ui/core/styles';

import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import { connectAuthProvider } from '@terralego/core/modules/Auth';

import JSONInput from '../../../../components/react-admin/JSONInput';
import FieldGroup from '../../../../components/react-admin/FieldGroup';
import UserFieldsHelp from './UserFieldsHelp';

import { RES_USERGROUP } from '../../ra-modules';

const useStyles = makeStyles({
  inline: {
    display: 'inline-block',
    marginRight: '1em',
  },
});

const Br = () => <br />;

const UserFields = ({ edit = false, user: { is_superuser: isSuperUser } = {}, ...props }) => {
  const classes = useStyles();
  const translate = useTranslate();

  const [advanced, setAdvanced] = React.useState(false);

  const onAdvancedChange = ({ target: { checked } }) => {
    setAdvanced(checked);
  };

  return (
    <SimpleForm {...props}>
      <TextInput
        source="properties.first_name"
        label="user.form.firstname"
        formClassName={classes.inline}
      />
      <TextInput
        source="properties.last_name"
        label="user.form.lastname"
        formClassName={classes.inline}
      />

      <Br />

      <TextInput source="email" type="email" />
      {!edit && <TextInput source="password" type="password" />}

      <Br />

      <BooleanInput
        source="is_superuser"
        disabled={!isSuperUser}
        helperText={!isSuperUser && translate('user.form.not-allowed-to-edit')}

        formClassName={classes.inline}
      />
      <BooleanInput
        source="is_active"
        formClassName={classes.inline}
      />

      <Br />

      <ReferenceArrayInput source="groups" reference={RES_USERGROUP}>
        <SelectArrayInput optionText="name" />
      </ReferenceArrayInput>

      <>
        <Typography variant="h6" component="h4">
          {translate('user.form.additional-information')}
        </Typography>
      </>
      <FieldGroup>
        <TextInput source="properties.position" label="user.form.position" />
        <TextInput source="properties.organization" label="user.form.organization" />
        <TextInput source="properties.address.street" label="user.form.address-street" />
        <TextInput source="properties.address.city" label="user.form.address-city" />
        <TextInput source="properties.address.zip_code" label="user.form.address-zip-code" />
      </FieldGroup>

      <>
        <FormGroup row>
          <FormControlLabel
            control={(
              <Switch
                onChange={onAdvancedChange}
                checked={advanced}
                name="advanced"
                color="primary"
                inputProps={{ 'aria-label': translate('user.form.advanced-button') }}
              />
          )}
            label={translate('user.form.advanced')}
          />
          {advanced && <JSONInput source="properties" label="user.form.additional-information" fullWidth />}
        </FormGroup>
      </>

      <UserFieldsHelp />
    </SimpleForm>
  );
};

export default connectAuthProvider('user')(UserFields);
