import React from 'react';
import {
  FormGroup,
  Button,
  H3,
} from '@blueprintjs/core';
import { DateInput } from '@blueprintjs/datetime';
import { Form, Field } from 'react-final-form';
import { withNamespaces } from 'react-i18next';

import { validateUpload } from '../validateForm';

export class AddPicture extends React.Component {
  state = {
    picture: '',
    datePicture: '',
  };

  onSubmit = () => {
    const { viewpoint: { id, label }, uploadPictureViewpoint } = this.props;
    const { datePicture, picture } = this.state;
    const data = {
      id,
      label,
      picture:
        {
          date: datePicture,
          file: picture,
        },
    };
    uploadPictureViewpoint(data);
  };

  handleChangeFile = ({ target: { files: [picture] } }) => this.setState({ picture });

  handleDateChange = datePicture =>
    this.setState({ datePicture: datePicture && datePicture.toISOString() });

  render () {
    const { onSubmit, handleChangeFile } = this;
    const { t } = this.props;
    const jsDateFormatter = {
      formatDate: date => date.toLocaleDateString(),
      parseDate: str => new Date(str),
      placeholder: 'JJ/MM/AAAA',
    };
    return (
      <>
        <H3>{t('opp.viewpoint.edit.addPicture')}</H3>
        <div className="picture-add">
          <Form
            onSubmit={onSubmit}
            initialValues={this.state}
            validate={validateUpload}
            render={({ handleSubmit, invalid }) => (
              <form
                onSubmit={handleSubmit}
                className="form-add-image"
              >
                <FormGroup>
                  <Field name="picture">
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
                  <Field name="datePicture">
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
