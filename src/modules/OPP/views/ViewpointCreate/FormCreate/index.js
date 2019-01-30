import React from 'react';
import {
  FormGroup,
  InputGroup,
  Button,
} from '@blueprintjs/core';
import { DateInput } from '@blueprintjs/datetime';
import { withNamespaces } from 'react-i18next';
import { Field } from 'react-final-form';

import './form-create.scss';

export class FormCreate extends React.Component {
  state = {
    disabled: true,
  };

  handlePicture = (e, input, form) => {
    const { onPicture } = this.props;
    input.onChange(e);
    onPicture(e.target.files[0]);
    this.setState(prevState => ({
      disabled: !prevState.disabled,
    }));

    if (e.target.files.length === 0) {
      form.change('datePicture', null);
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
    const { disabled } = this.state;
    return (
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
                    onChange={e => handlePicture(e, input, form)}
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
        <Button text={t('main.reset')} onClick={form.reset} disabled={submitting || pristine} />
      </form>

    );
  }
}

export default withNamespaces()(FormCreate);
