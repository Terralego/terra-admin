import React from 'react';
import { Field } from 'react-final-form';
import { Button, FormGroup, InputGroup, Intent, Overlay } from '@blueprintjs/core';
import { withTranslation } from 'react-i18next';

import InputMap from '../../../../../components/InputMap';

import './form-metadata.scss';

const displayError = meta => !!meta.error && meta.touched;

export class FormMetadata extends React.Component {
  state = {
    isOpen: false,
  };

  handleCoordinate = value => {
    const { form } = this.props;
    form.change('geometry.coordinates[0]', value ? value[0] : null);
    form.change('geometry.coordinates[1]', value ? value[1] : null);
  };

  toggleOpenOverlay = () => this.setState(({ isOpen: prevIsOpen }) => ({ isOpen: !prevIsOpen }));

  render () {
    const {
      handleCoordinate,
      toggleOpenOverlay,
    } = this;
    const {
      t,
      handleSubmit,
      invalid,
      form,
      submitting,
      pristine,
    } = this.props;
    const { isOpen } = this.state;
    return (
      <form
        method="put"
        onSubmit={handleSubmit}
        className="form-edit"
      >
        <FormGroup>
          <Field name="label">
            {({ input, meta, meta: { error } }) => (
              <FormGroup
                helperText={displayError(meta) && t('form.error', { context: error, name: input.name })}
                intent={displayError(meta) ? Intent.DANGER : Intent.NONE}
                label={t('opp.viewpoint.edit.label')}
                labelInfo={t('form.required')}
              >
                <InputGroup
                  {...input}
                  leftIcon="tag"
                  placeholder={t('opp.viewpoint.edit.label')}
                />
              </FormGroup>
            )}
          </Field>
          <Field name="geometry.coordinates[0]">
            {({ input, meta, meta: { error } }) => (
              <FormGroup
                helperText={displayError(meta) && t('form.error', { context: error, name: 'longitude', min: '-180°', max: '+180°' })}
                intent={displayError(meta) ? Intent.DANGER : Intent.NONE}
                label={t('opp.viewpoint.edit.longitude.label')}
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
          <Field name="geometry.coordinates[1]">
            {({ input, meta, meta: { error } }) => (
              <FormGroup
                helperText={displayError(meta) && t('form.error', { context: error, name: 'latitude', min: '-90°', max: '+90°' })}
                intent={displayError(meta) ? Intent.DANGER : Intent.NONE}
                label={t('opp.viewpoint.edit.latitude.label')}
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
            <Button text={t('opp.viewpoint.edit.show-map')} onClick={toggleOpenOverlay} />
            <Overlay isOpen={isOpen} onClose={toggleOpenOverlay}>
              <Field name="geometry.coordinates[0]">
                {({ input: { value: longitude } }) => (
                  <Field name="geometry.coordinates[1]">
                    {({ input: { value: latitude } }) => (
                      <InputMap
                        value={[+longitude, +latitude]}
                        onChange={value => handleCoordinate(value)}
                      />
                    )}
                  </Field>
                )}
              </Field>
            </Overlay>
          </div>
        </FormGroup>
        <Button text={t('form.submit')} intent="primary" type="submit" disabled={invalid || pristine} />
        <Button text={t('form.reset')} onClick={form.reset} disabled={submitting || pristine} />
      </form>
    );
  }
}

export default withTranslation()(FormMetadata);
