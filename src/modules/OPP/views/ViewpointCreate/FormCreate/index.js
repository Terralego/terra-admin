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

import localeUtils from 'mc-tf-test/utils/localeUtils';

import { locale, localErrorMessages } from '../../../../../utils/date';
import InputMap from '../../../components/InputMap';

import './form-create.scss';

const displayError = meta => !!meta.error && meta.touched;

const displayDateError = meta => !!meta.error;

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

  handleCoordinate = value => {
    const { form } = this.props;
    form.change('longitude', value ? value[0] : null);
    form.change('latitude', value ? value[1] : null);
  };

  formatDate = date => date.toLocaleDateString();

  parseDate = str => new Date(str);

  render () {
    const {
      handlePicture,
      handleCoordinate,
      formatDate,
      parseDate,
    } = this;
    const {
      t,
      handleSubmit,
      invalid,
      form,
      submitting,
      pristine,
    } = this.props;
    return (
      <form
        onSubmit={handleSubmit}
        className="form-create"
      >
        <Field name="label">
          {({ input, meta, meta: { error } }) => (
            <FormGroup
              helperText={displayError(meta) && t('form.error', { context: error, name: input.name })}
              intent={displayError(meta) ? Intent.DANGER : Intent.NONE}
              label={t('opp.viewpoint.create.label')}
              labelInfo={t('form.required')}
            >
              <InputGroup
                {...input}
                leftIcon="tag"
                placeholder={t('opp.form.label')}
              />
            </FormGroup>
          )}
        </Field>
        <Field name="longitude">
          {({ input, meta, meta: { error } }) => (
            <FormGroup
              helperText={displayError(meta) && t('form.error', { context: error, name: input.name, min: '-180°', max: '+180°' })}
              intent={displayError(meta) ? Intent.DANGER : Intent.NONE}
              label={t('opp.viewpoint.create.longitude.label')}
              labelInfo={t('form.required')}
            >
              <InputGroup
                {...input}
                leftIcon="map"
                placeholder={t('opp.viewpoint.create.longitude.placeholder')}
              />
            </FormGroup>
          )}
        </Field>
        <Field name="latitude">
          {({ input, meta, meta: { error } }) => (
            <FormGroup
              helperText={displayError(meta) && t('form.error', { context: error, name: input.name, min: '-90°', max: '+90°' })}
              intent={displayError(meta) ? Intent.DANGER : Intent.NONE}
              label={t('opp.viewpoint.create.latitude.label')}
              labelInfo={t('form.required')}
            >
              <InputGroup
                {...input}
                leftIcon="map"
                placeholder={t('opp.viewpoint.create.latitude.placeholder')}
              />
            </FormGroup>
          )}
        </Field>
        <div className="coordinate">
          <Field name="longitude">
            {({ input: { value: longitude } }) => (
              <Field name="latitude">
                {({ input: { value: latitude } }) => (
                  <InputMap
                    value={[+longitude, +latitude]}
                    onChange={value => handleCoordinate(value)}
                  />
                )}
              </Field>
            )}
          </Field>
        </div>
        <Field name="pictureFile">
          {({ input }) => (
            <FormGroup
              label={t('opp.viewpoint.create.picture')}
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
              {({ input, meta, meta: { error } }) => (
                <FormGroup
                  helperText={displayDateError(meta) && t('form.error', { context: error, name: input.name })}
                  intent={displayDateError(meta) ? Intent.DANGER : Intent.NONE}
                  label={t('opp.viewpoint.create.date')}
                  labelFor="text-input"
                  labelInfo={t('form.required')}
                  disabled={pictureFilePristine}
                >
                  <DateInput
                    formatDate={formatDate}
                    parseDate={parseDate}
                    placeholder={t('opp.viewpoint.create.date-format')}
                    showActionsBar
                    invalidDateMessage={localErrorMessages.invalidDateMessage}
                    localeUtils={localeUtils}
                    locale={locale}
                    todayButtonText={t('date.today')}
                    clearButtonText={t('date.clear')}
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
