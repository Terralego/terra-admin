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
    viewpoint: {},
  };

  componentDidMount () {
    const { viewpoint: { ...viewpoint } } = this.props;
    this.setState({ viewpoint });
  }

  handleChangeLabel = ({ target: { value } }) => {
    this.setState(prevState => ({
      viewpoint: {
        ...prevState.viewpoint,
        label: value,
      },
    }));
  };

  onSubmit = () => {
    const { viewpoint: { id }, editViewpoint } = this.props;
    const { viewpoint: viewpointState } = this.state;
    editViewpoint(id, viewpointState);
  };

  render () {
    const { onSubmit, handleChangeLabel } = this;
    const { viewpoint } = this.state;
    const { t } = this.props;
    return (
      <>
        <H3>{t('opp.viewpoint.edit.title')}</H3>
        <Form
          onSubmit={onSubmit}
          initialValues={viewpoint}
          validate={values => {
            const errors = {};
            if (!values.label) {
              errors.label = 'Requis';
            }
            return errors;
          }}
          render={({ handleSubmit, invalid }) => (
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
