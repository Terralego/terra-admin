import React from 'react';
import {
  FormGroup,
  Button,
  H3,
  Intent,
} from '@blueprintjs/core';
import { DateInput } from '@blueprintjs/datetime';
import { Form, Field } from 'react-final-form';
import { withNamespaces } from 'react-i18next';

import { validateAddPicture } from './validateAddPictureForm';
import { toast } from '../../../../utils/toast';

const displayError = ({ error, touched }) => !!(error && touched);

export class AddPicture extends React.Component {
  state = {
    pictureFile: {},
  };

  onSubmit = async values => {
    const { viewpoint, uploadPictureViewpointAction, t } = this.props;
    const { pictureFile } = this.state;
    const data = { ...values, ...viewpoint, pictureFile };
    const editViewpoint = await uploadPictureViewpointAction(data);
    toast.displayToaster(
      editViewpoint,
      t('opp.form.toast-success', { context: 'add-picture', name: editViewpoint.label }),
      t('opp.form.toast-error'),
    );
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
            render={({ handleSubmit, form: { reset }, invalid, submitting }) => (
              <form
                className="form-add-image"
                onSubmit={event => {
                  handleSubmit(event).then(reset);
                }}
              >
                <Field name="pictureFile">
                  {({ input, meta, meta: { error } }) => (
                    <FormGroup
                      helperText={displayError(meta) && t('form.error', { context: `${error}-picture` })}
                      intent={displayError(meta) ? Intent.DANGER : Intent.NONE}
                      label={t('opp.viewpoint.edit.picture')}
                      labelInfo={t('form.required')}
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
                      label={t('opp.viewpoint.edit.date')}
                      labelInfo={t('form.required')}
                    >
                      <DateInput
                        formatDate={formatDate}
                        parseDate={parseDate}
                        placeholder={t('opp.viewpoint.edit.date-format')}
                        showActionsBar
                        {...input}
                        value={input.value || null}
                        inputProps={{ onBlur: input.onBlur }}
                      />
                    </FormGroup>
                  )}
                </Field>
                <Button text={t('form.submit')} intent="primary" type="submit" disabled={invalid || submitting} />
              </form>
            )}
          />
        </div>
      </>
    );
  }
}

export default withNamespaces()(AddPicture);
