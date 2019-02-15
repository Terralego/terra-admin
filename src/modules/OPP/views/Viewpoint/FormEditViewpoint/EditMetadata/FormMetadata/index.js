import React from 'react';
import { Field } from 'react-final-form';
import { Button, FormGroup, InputGroup, Overlay } from '@blueprintjs/core';
import { withNamespaces } from 'react-i18next';

import InputMap from '../../../../../components/InputMap';

import './form-metadata.scss';
import { connectAppProvider } from '../../../../../../../components/AppProvider';

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
            {({ input, meta }) => (
              <>
                <InputGroup
                  {...input}
                  leftIcon="tag"
                />
                {meta.error && meta.touched && <span>{meta.error}</span>}
              </>
            )}
          </Field>
          <Field name="geometry.coordinates[0]">
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
          <Field name="geometry.coordinates[1]">
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
          <div className="coordinate">
            <Button text="Show overlay" onClick={toggleOpenOverlay} />
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

export default connectAppProvider(({ env: { configMap } }) => ({
  mapSettings: configMap,
}))(withNamespaces()(FormMetadata));
