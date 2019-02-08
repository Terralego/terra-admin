import React from 'react';
import { Field } from 'react-final-form';
import { Button, FormGroup, InputGroup, Intent, Overlay } from '@blueprintjs/core';
import { withNamespaces } from 'react-i18next';

import InputMap from '../../../../../components/InputMap';

import './form-metadata.scss';

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
      mapSettings,
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
          <Field name="geometry.coordinates[0]">
            {({ input, meta: { error, touched } }) => (
              <FormGroup
                helperText={(!!error && touched) && t('form.error', { context: error, name: 'longitude', min: '-180°', max: '+180°' })}
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
          <Field name="geometry.coordinates[1]">
            {({ input, meta: { error, touched } }) => (
              <FormGroup
                helperText={(!!error && touched) && t('form.error', { context: error, name: 'latitude', min: '-90°', max: '+90°' })}
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
          <div className="coordinate">
            <Button text={t('opp.viewpoint.edit.show-map')} onClick={toggleOpenOverlay} />
            <Overlay isOpen={isOpen} onClose={toggleOpenOverlay}>
              <Field name="geometry.coordinates[0]">
                {({ input: { value: longitude } }) => (
                  <Field name="geometry.coordinates[1]">
                    {({ input: { value: latitude } }) => (
                      <InputMap
                        configMap={mapSettings}
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
        <Button text={t('form.submit')} intent="primary" type="submit" disabled={invalid} />
        <Button text={t('form.reset')} onClick={form.reset} disabled={submitting || pristine} />
      </form>
    );
  }
}

export default withNamespaces()(FormMetadata);
