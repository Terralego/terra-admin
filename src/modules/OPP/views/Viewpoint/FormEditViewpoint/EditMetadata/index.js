import React from 'react';
import {
  FormGroup,
  InputGroup,
  Button,
  H3,
} from '@blueprintjs/core';
import { Form, Field } from 'react-final-form';
import { withNamespaces } from 'react-i18next';

import { validateEdit } from './validateEditForm';

export class EditMetadata extends React.Component {
  state = {
    // eslint-disable-next-line react/destructuring-assignment
    viewpoint: { ...this.props.viewpoint },
  };

  onSubmit = () => {
    const { saveViewpointAction } = this.props;
    const { viewpoint } = this.state;
    saveViewpointAction(viewpoint);
  };

  handleChangeLabel = ({ target: { value } }) => this.setState(prevState => ({
    viewpoint: {
      ...prevState.viewpoint,
      label: value,
    },
  }));

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
          validate={validateEdit}
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
