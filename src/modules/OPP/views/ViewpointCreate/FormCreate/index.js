import React from 'react';
import {
  FormGroup,
  InputGroup,
  Button,
  Intent,
} from '@blueprintjs/core';
import { DateInput } from '@blueprintjs/datetime';
import { withNamespaces } from 'react-i18next';
import { Field } from 'react-final-form';

import './form-create.scss';

export class FormCreate extends React.Component {
  handlePicture = (e, input, form) => {
    input.onChange(e);
    const { onPicture } = this.props;
    const { target: { files: [file] } } = e;
    onPicture(file);

    if (file) {
      form.change('date', null);
    }
  };

  formatDate = date => date.toLocaleDateString();

  parseDate = str => new Date(str);

  render () {
    const {
      handlePicture,
      formatDate,
      parseDate,
    } = this;
    const { t, handleSubmit, invalid, form, submitting, pristine } = this.props;

    return (
      <form
        method="put"
        onSubmit={handleSubmit}
        className="form-create"
      >
        <Field name="label">
          {({ input, meta: { error, touched } }) => (
            <FormGroup
              helperText={(!!error && touched) && t('form.error', { context: error, name: input.name })}
              intent={(!!error && touched) ? Intent.DANGER : Intent.NONE}
              label="Libellé"
              labelFor="text-input"
              labelInfo="(*)"
            >
              <InputGroup
                {...input}
                leftIcon="tag"
                placeholder="Libellé"
              />
            </FormGroup>
          )}
        </Field>
        <Field name="longitude">
          {({ input, meta: { error, touched } }) => (
            <FormGroup
              helperText={(!!error && touched) && t('form.error', { context: error, name: input.name, min: '-180°', max: '+180°' })}
              intent={(!!error && touched) ? Intent.DANGER : Intent.NONE}
              label="Longitude"
              labelFor="text-input"
              labelInfo="(*)"
            >
              <InputGroup
                {...input}
                leftIcon="map"
                placeholder="Longitude : -61.2018"
              />
            </FormGroup>
          )}
        </Field>
        <Field name="latitude">
          {({ input, meta: { error, touched } }) => (
            <FormGroup
              helperText={(!!error && touched) && t('form.error', { context: error, name: input.name, min: '-90°', max: '+90°' })}
              intent={(!!error && touched) ? Intent.DANGER : Intent.NONE}
              label="Latitude"
              labelFor="text-input"
              labelInfo="(*)"
            >
              <InputGroup
                {...input}
                leftIcon="map"
                placeholder="Latitude : 14.7786"
              />
            </FormGroup>
          )}
        </Field>
        <Field name="pictureFile">
          {({ input, meta: { error, touched } }) => (
            <FormGroup
              helperText={(!!error && touched) && t(`main.validator-form.${error}`, { context: input.name })}
              intent={(!!error && touched) ? Intent.DANGER : Intent.NONE}
              label="Picture"
              labelFor="text-input"
            >
              <label htmlFor="pictureFile">
                <input
                  type="file"
                  id="pictureFile"
                  name="pictureFile"
                  {...input}
                  onChange={e => handlePicture(e, input, form)}
                />
              </label>
            </FormGroup>
          )}
        </Field>
        <Field name="pictureFile">
          {({ meta: { pristine: pictureFilePristine } }) => (
            <Field type="date" name="date">
              {({ input, meta: { error } }) => (
                <FormGroup
                  helperText={error && t('form.error', { context: error, name: input.name })}
                  intent={(error) ? Intent.DANGER : Intent.NONE}
                  label="Date"
                  labelFor="text-input"
                  labelInfo="(*)"
                  disabled={pictureFilePristine}
                >
                  <DateInput
                    formatDate={formatDate}
                    parseDate={parseDate}
                    placeholder="JJ/MM/AAAA"
                    showActionsBar
                    {...input}
                    value={input.value || null}
                  />
                </FormGroup>
              )}
            </Field>
          )}
        </Field>
        <Button text={t('form.submit')} intent="primary" type="submit" disabled={invalid} />
        <Button text={t('form.reset')} onClick={form.reset} disabled={submitting || pristine} />
      </form>

    );
  }
}

export default withNamespaces()(FormCreate);
