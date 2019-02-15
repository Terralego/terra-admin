import React from 'react';
import {
  H3,
} from '@blueprintjs/core';
import { Form } from 'react-final-form';
import { withNamespaces } from 'react-i18next';

import { validateEdit } from './validateFormMetadata';
import FormMetadata from './FormMetadata';
import { toast } from '../../../../utils/toast';

export class EditMetadata extends React.Component {
  onSubmit = async values => {
    const { saveViewpointAction, t } = this.props;
    const editViewpoint = await saveViewpointAction(values);
    toast.displayToaster(
      editViewpoint,
      t('opp.form.success.notification', { context: 'edit', name: editViewpoint.label }),
      t('opp.form.error.server'),
    );
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
