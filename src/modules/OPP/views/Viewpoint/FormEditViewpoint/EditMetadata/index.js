import React from 'react';
import {
  H3,
  Toaster,
  Intent,
} from '@blueprintjs/core';
import { Form } from 'react-final-form';
import { withNamespaces } from 'react-i18next';

import { validateEdit } from './validateFormMetadata';
import FormMetadata from './FormMetadata';

export const submitToaster = Toaster.create();

export class EditMetadata extends React.Component {
  onSubmit = async values => {
    const { saveViewpointAction, t } = this.props;
    const editViewpoint = await saveViewpointAction(values);
    submitToaster.show({
      message: editViewpoint.id ? t('opp.form.toast-success', { name: editViewpoint.label }) : t('opp.form.toast-error'),
      intent: editViewpoint.id ? Intent.SUCCESS : Intent.DANGER,
    });
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
          render={formProps => (
            <FormMetadata
              {...formProps}
            />
          )}
        />
      </>
    );
  }
}

export default withNamespaces()(EditMetadata);
