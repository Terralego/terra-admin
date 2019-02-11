import React from 'react';
import {
  FormGroup,
  Button,
  H3, Intent,
} from '@blueprintjs/core';
import { DateInput } from '@blueprintjs/datetime';
import { Form, Field } from 'react-final-form';
import { withNamespaces } from 'react-i18next';

import { validateAddPicture } from './validateAddPictureForm';

const displayError = meta => !!meta.error && meta.touched;

export class AddPicture extends React.Component {
  state = {
    pictureFile: {},
  };

  onSubmit = values => {
    const { viewpoint: { id, label }, uploadPictureViewpointAction } = this.props;
    const { pictureFile } = this.state;
    const data = { ...values, pictureFile, id, label };
    uploadPictureViewpointAction(data);
  };

  handlePicture = (e, input) => {
    input.onChange(e);
    const { target: { files: [file] } } = e;
    this.setState({ pictureFile: file });
  };

  formatDate = date => date.toLocaleDateString();

  parseDate = str => new Date(str);

  render () {
    const { onSubmit, handlePicture, formatDate, parseDate } = this;
    const { t } = this.props;
    return (
      <>
        <H3>{t('opp.viewpoint.edit.add-picture')}</H3>
        <div className="picture-add">
          <Form
            onSubmit={onSubmit}
            validate={validateAddPicture}
            render={({ handleSubmit, invalid }) => (
              <form
                onSubmit={handleSubmit}
                className="form-add-image"
              >
                <Field name="pictureFile">
                  {({ input, meta, meta: { error } }) => (
                    <FormGroup
                      helperText={displayError(meta) && t('form.error', { context: error, name: input.name })}
                      intent={displayError(meta) ? Intent.DANGER : Intent.NONE}
                      label="Image"
                      labelInfo="(*)"
                    >
                      <label htmlFor="picture">
                        <input
                          type="file"
                          id="picture"
                          name="picture"
                          {...input}
                          onChange={e => handlePicture(e, input)}
                        />
                      </label>
                    </FormGroup>
                  )}
                </Field>
                <Field type="date" name="date">
                  {({ input, meta }) => (
                    <FormGroup
                      helperText={displayError(meta) && t('form.error', { context: meta.error, name: input.name })}
                      intent={displayError(meta) ? Intent.DANGER : Intent.NONE}
                      label="Date"
                      labelInfo="(*)"
                    >
                      <DateInput
                        formatDate={formatDate}
                        parseDate={parseDate}
                        placeholder="JJ/MM/AAAA"
                        showActionsBar
                        {...input}
                        value={input.value || null}
                        inputProps={{ onBlur: () => input.onBlur() }}
                      />
                    </FormGroup>
                  )}
                </Field>
                <Button text={t('form.submit')} intent="primary" type="submit" disabled={invalid} />
              </form>
            )}
          />
        </div>
      </>
    );
  }
}

export default withNamespaces()(AddPicture);
