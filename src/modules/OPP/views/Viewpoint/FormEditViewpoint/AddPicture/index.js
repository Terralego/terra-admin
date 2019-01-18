import React from 'react';
import {
  FormGroup,
  Button,
  H3,
} from '@blueprintjs/core';
import { Form, Field } from 'react-final-form';
import { withNamespaces } from 'react-i18next';

export class AddPicture extends React.Component {
  state = {
    label: this.props.viewpoint.label,
    thumbnail: '',
  };

  handleChangeFile = e => {
    this.setState({ thumbnail: e.target.value });
  };

  onSubmit = () => {
    const { viewpoint, fetchViewpointPut } = this.props;
    fetchViewpointPut(viewpoint.id, this.state);
  };

  render () {
    const { onSubmit, handleChangeFile } = this;
    const { t } = this.props;
    const required = value => (value ? undefined : 'Requis');
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
                  <Field name="thumbnail" validate={required}>
                    {({ input, meta }) => (
                      <>
                        <label htmlFor="picture">
                          <input
                            type="file"
                            id="thumbnail"
                            name="thumbnail"
                            onChange={handleChangeFile}
                          />
                        </label>
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
