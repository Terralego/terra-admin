import React from 'react';
import {
  H3,
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
    disabled: true,
    picture: {
      pictureFile: {},
    },
  };

  onSubmit = async values => {
    const { saveViewpointAction, history } = this.props;
    const { picture } = this.state;
    const data = { ...values, ...picture };
    console.log(data);
    // await saveViewpointAction(data);
    // const { viewpoints: { newViewpoint: { id } } } = this.props;
    // history.push(`${id}`);
  };

  handlePicture = (e, input) => {
    input.onChange(e);
    this.setState({ picture: { pictureFile: e.target.files[0] } });
    this.setState(prevState => ({
      disabled: !prevState.disabled,
    }));
  };

  formatDate = date => date.toLocaleDateString();

  parseDate = str => new Date(str);

  render () {
    const {
      onSubmit,
      handlePicture,
      formatDate,
      parseDate,
    } = this;
    const { t } = this.props;
    const { disabled } = this.state;
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
                        {...input}
                        value={input.value || null}
                        disabled={disabled}
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
