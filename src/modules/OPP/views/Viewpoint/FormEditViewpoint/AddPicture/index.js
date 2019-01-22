import React from 'react';
import {
  FormGroup,
  Button,
  H3,
} from '@blueprintjs/core';
import { DateInput } from '@blueprintjs/datetime';
import { Form, Field } from 'react-final-form';
import { withNamespaces } from 'react-i18next';

export class AddPicture extends React.Component {
  state = {
    label: this.props.viewpoint.label,
    picture: '',
    datePicture: '',
  };

  handleChangeFile = e => {
    this.setState({ picture: e.target.files[0] });
  };

  handleDateChange = datePicture => this.setState({ datePicture: datePicture.toISOString() });

  onSubmit = () => {
    const { viewpoint, fetchViewpointPut } = this.props;
    const { label, datePicture, picture } = this.state;
    const formData = new FormData();
    formData.append('label', label);
    formData.append('picture.date', datePicture);
    formData.append('picture.file', picture);
    fetchViewpointPut(viewpoint.id, formData);
  };

  render () {
    const { onSubmit, handleChangeFile } = this;
    const { t } = this.props;
    const required = value => (value ? undefined : 'Requis');
    const jsDateFormatter = {
      formatDate: date => date.toLocaleDateString(),
      parseDate: str => new Date(str),
      placeholder: 'JJ/DD/YYYY',
    };
    return (
      <>
        <H3>{t('opp.title.addImage')}</H3>
        <div className="picture-add">
          <Form
            onSubmit={onSubmit}
            initialValues={this.state}
            render={({ handleSubmit, invalid }) => (
              <form
                method="put"
                onSubmit={handleSubmit}
                className="form-edit"
              >
                <FormGroup>
                  <Field name="picture" validate={required}>
                    {({ input, meta }) => (
                      <>
                        <label htmlFor="picture">
                          <input
                            type="file"
                            id="picture"
                            name="picture"
                            onChange={handleChangeFile}
                          />
                        </label>
                        {meta.error && meta.touched && <span>{meta.error}</span>}
                      </>
                    )}
                  </Field>
                  <Field name="datePicture" validate={required}>
                    {({ meta }) => (
                      <>
                        <DateInput
                          {...jsDateFormatter}
                          showActionsBar
                          onChange={this.handleDateChange}
                        />
                        {meta.error && meta.touched && <span>{meta.error}</span>}
                      </>
                    )}
                  </Field>
                </FormGroup>
                <Button text={t('main.submit')} intent="primary" type="submit" disabled={invalid} />
              </form>
            )}
          />
        </div>
      </>
    );
  }
}

export default withNamespaces()(AddPicture);
