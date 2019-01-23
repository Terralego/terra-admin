import React from 'react';
import {
  FormGroup,
  InputGroup,
  Button,
  H3,
} from '@blueprintjs/core';
import { Form, Field } from 'react-final-form';
import { withNamespaces } from 'react-i18next';

export class EditMetadata extends React.Component {
  state = {
    label: '',
  };

  componentDidMount () {
    const { viewpoint: { label } } = this.props;
    this.setState({ label });
  }

  handleChangeLabel = e => {
    this.setState({ label: e.target.value });
  };


  onSubmit = () => {
    const { viewpoint, editViewpoint } = this.props;
    editViewpoint(viewpoint.id, this.state);
  };

  render () {
    const { onSubmit, handleChangeLabel } = this;
    const { t } = this.props;
    const required = value => (value ? undefined : 'Requis');
    return (
      <>
        <H3>{t('opp.viewpoint.edit.title')}</H3>
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
                <Field name="label" validate={required} placeholder="Username">
                  {({ input, meta }) => (
                    <>
                      <InputGroup
                        {...input}
                        leftIcon="tag"
                        onChange={handleChangeLabel}
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
      </>
    );
  }
}

export default withNamespaces()(EditMetadata);
