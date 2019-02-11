import React from 'react';
import {
  H3,
} from '@blueprintjs/core';
import { Form } from 'react-final-form';
import { withNamespaces } from 'react-i18next';

import { validateEdit } from './validateFormMetadata';
import FormMetadata from './FormMetadata';

export class EditMetadata extends React.Component {
  onSubmit = values => {
    const { saveViewpointAction } = this.props;
    saveViewpointAction(values);
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
