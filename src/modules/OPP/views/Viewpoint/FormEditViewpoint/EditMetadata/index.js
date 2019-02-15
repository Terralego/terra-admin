import React from 'react';
import {
  H3,
} from '@blueprintjs/core';
import { Form } from 'react-final-form';
import { withNamespaces } from 'react-i18next';

import { validateEdit } from './validateEditForm';
import FormMetadata from './FormMetadata';

export class EditMetadata extends React.Component {
  onSubmit = value => {
    const { saveViewpointAction } = this.props;
    saveViewpointAction(value);
  };

  render () {
    const { onSubmit } = this;
    const { t, viewpoint } = this.props;
    return (
      <>
        <H3>{t('opp.viewpoint.edit.title')}</H3>
        <Form
          onSubmit={onSubmit}
          initialValues={viewpoint}
          validate={validateEdit}
          render={({ handleSubmit, invalid, form, pristine, submitting }) => (
            <FormMetadata
              handleSubmit={handleSubmit}
              invalid={invalid}
              form={form}
              submitting={submitting}
              pristine={pristine}
            />
          )}
        />
      </>
    );
  }
}

export default withNamespaces()(EditMetadata);
