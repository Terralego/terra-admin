import React from 'react';
import {
  H3,
  Checkbox,
  Icon,
  FormGroup,
  InputGroup,
  Button,
} from '@blueprintjs/core';
import { DateInput } from '@blueprintjs/datetime';
import { withNamespaces } from 'react-i18next';
import { Field, Form } from 'react-final-form';
import { withRouter } from 'react-router-dom';

import { validateCreate } from './validateCreateForm';

export class FormCreateViewpoint extends React.Component {
  state = {
    isEnabled: false,
    picture: {
      pictureFile: {},
    },
  };

  onSubmit = async values => {
    const { saveViewpointAction, history } = this.props;
    const { picture } = this.state;
    const data = { ...values, ...picture };
    await saveViewpointAction(data);
    const { viewpoints: { newViewpoint: { id } } } = this.props;
    history.push(`${id}`);
  };

  handleAddPicture = (e, input) => {
    input.onChange(e);
    this.setState({ isEnabled: input.checked });
  };

  handlePicture = (e, input) => {
    input.onChange(e);
    this.setState({ picture: { pictureFile: e.target.files[0] } });
  };

  handleDateChange = (date, input) => {
    date ? input.onChange(date.toISOString()) : input.onChange(date);
  };

  formatDate = date => date.toLocaleDateString();

  parseDate = str => new Date(str);

  render () {
    const {
      onSubmit,
      handleAddPicture,
      handleDateChange,
      handlePicture,
      formatDate,
      parseDate,
    } = this;
    const { isEnabled } = this.state;
    const { t } = this.props;

    return (
      <>
        <H3>{t('opp.viewpoint.create.title')}</H3>
        <Form
          onSubmit={onSubmit}
          validate={validateCreate}
          render={({ handleSubmit, invalid }) => (
            <form
              method="put"
              onSubmit={handleSubmit}
              className="form-create"
            >
              <FormGroup>
                <Field name="label">
                  {({ input, meta }) => (
                    <>
                      <InputGroup
                        {...input}
                        leftIcon="tag"
                        placeholder="Label"
                      />
                      {meta.error && meta.touched && <span>{meta.error}</span>}
                    </>
                  )}
                </Field>
                <Field name="longitude">
                  {({ input, meta }) => (
                    <>
                      <InputGroup
                        {...input}
                        leftIcon="map"
                        placeholder="Longitude : -61.2018"
                      />
                      {meta.error && meta.touched && <span>{meta.error}</span>}
                    </>
                  )}
                </Field>
                <Field name="latitude">
                  {({ input, meta }) => (
                    <>
                      <InputGroup
                        {...input}
                        leftIcon="map"
                        placeholder="Latitude : 14.7786"
                      />
                      {meta.error && meta.touched && <span>{meta.error}</span>}
                    </>
                  )}
                </Field>
                <Field
                  name="addPicture"
                  type="checkbox"
                >
                  {({ input }) => (
                    <Checkbox
                      inline
                      checked={isEnabled}
                      {...input}
                      onChange={e => handleAddPicture(e, input)}
                    >
                      <Icon icon="camera" />
                    </Checkbox>
                  )}
                </Field>
                <Field name="pictureFile">
                  {({ input, meta }) => (
                    <>
                      <label htmlFor="pictureFile">
                        <input
                          type="file"
                          id="pictureFile"
                          name="pictureFile"
                          {...input}
                          onChange={e => handlePicture(e, input)}
                        />
                      </label>
                      {meta.error && <span>{meta.error}</span>}
                    </>
                  )}
                </Field>
                <Field type="date" name="datePicture">
                  {({ input, meta }) => (
                    <>
                      <DateInput
                        formatDate={formatDate}
                        parseDate={parseDate}
                        placeholder="JJ/MM/AAAA"
                        showActionsBar
                        onChange={e => handleDateChange(e, input)}
                        onBlur={input.onBlur}
                        onFocus={input.onFocus}
                        name={input.name}
                      />
                      {meta.error && <span>{meta.error}</span>}
                    </>
                  )}
                </Field>
              </FormGroup>
              <Button text={t('main.submit')} intent="primary" type="submit" disabled={invalid} />
            </form>
          )}
        />
      </>
    );
  }
}

export default withRouter(withNamespaces()(FormCreateViewpoint));
