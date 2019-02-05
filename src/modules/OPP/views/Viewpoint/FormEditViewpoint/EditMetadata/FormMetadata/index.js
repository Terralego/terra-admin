import React from 'react';
import { Field } from 'react-final-form';
import { Button, FormGroup, InputGroup, Overlay } from '@blueprintjs/core';
import { withNamespaces } from 'react-i18next';

import InputMap from '../../../../../components/InputMap';

import './form-metadata.scss';

const configMap = {
  accessToken: 'pk.eyJ1IjoibWFraW5hY29ycHVzIiwiYSI6ImNqY3E4ZTNwcTFta3ozMm80d2xzY29wM2MifQ.Nwl_FHrWAIQ46s_lY0KNiQ',
  backgroundStyle: 'mapbox://styles/mapbox/streets-v9',
  center: [-61.0134945, 14.6376395],
  zoom: 10,
  maxBounds: [[-62.2, 14.1], [-60.1, 15.0]],
};

export class FormMetadata extends React.Component {
  state = {
    isOpen: false,
  };

  handleCoordinate = value => {
    const { form } = this.props;
    if (value) {
      form.change('geometry.coordinates[0]', value[0]);
      form.change('geometry.coordinates[1]', value[1]);
    } else {
      form.change('geometry.coordinates[0]', null);
      form.change('geometry.coordinates[1]', null);
    }
  };

  toggleOpenOverlay = () => this.setState(prevState => ({
    isOpen: !prevState.isOpen,
  }));

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
                        configMap={configMap}
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
        <Button text={t('main.submit')} intent="primary" type="submit" disabled={invalid} />
        <Button text={t('main.reset')} onClick={form.reset} disabled={submitting || pristine} />
      </form>
    );
  }
}

export default withNamespaces()(FormMetadata);
