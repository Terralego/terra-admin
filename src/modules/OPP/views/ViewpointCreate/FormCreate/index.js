import React from 'react';
import {
  FormGroup,
  InputGroup,
  Button,
} from '@blueprintjs/core';
import { DateInput } from '@blueprintjs/datetime';
import { withNamespaces } from 'react-i18next';
import { Field } from 'react-final-form';

import RequiredItem from '../../../components/RequiredItem';

import './form-create.scss';

export class FormCreate extends React.Component {
  handlePicture = (e, input, form) => {
    input.onChange(e);
    const { onPicture } = this.props;
    const { target: { files: [file] } } = e;
    onPicture(file);

    if (file) {
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
                <RequiredItem
                  {...meta}
                  name={input.name}
                />
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
                <RequiredItem
                  {...meta}
                  name={input.name}
                />
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
                <RequiredItem
                  {...meta}
                  name={input.name}
                />
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
                <RequiredItem
                  {...meta}
                  name={input.name}
                />
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
                  disabled={form.getFieldState('pictureFile').pristine}
                />
                <RequiredItem
                  {...meta}
                  name={input.name}
                  forceDisplayRequired
                />
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
