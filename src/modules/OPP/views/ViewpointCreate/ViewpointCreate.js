import React from 'react';
import {
  H3,
} from '@blueprintjs/core';
import { withTranslation } from 'react-i18next';
import { Form } from 'react-final-form';
import { withRouter } from 'react-router-dom';

import { validateCreate } from './validateCreateForm';
import FormCreate from './FormCreate';
import { toast } from '../../../../utils/toast';

export class ViewpointCreate extends React.Component {
  state = {
    pictureFile: {},
  };

  onSubmit = async values => {
    const { saveViewpointAction, history, t } = this.props;
    const { pictureFile } = this.state;
    const data = { ...values, pictureFile };
    const newViewpoint = await saveViewpointAction(data);
    const { id } = newViewpoint;
    await history.push(`${id}`);
    toast.displayToaster(
      newViewpoint,
      t('opp.form.success.notification', { context: 'create', name: newViewpoint.label }),
      t('opp.form.error.server'),
    );
  };

  onPicture = file => {
    this.setState({ pictureFile: file });
  };

  render () {
    const {
      onSubmit,
      onPicture,
    } = this;
    const { t } = this.props;
    return (
      <>
        <H3>{t('opp.viewpoint.create.title')}</H3>
        <Form
          onSubmit={onSubmit}
          validate={validateCreate}
          render={formProps => (
            <FormCreate
              {...formProps}
              onPicture={onPicture}
            />
          )}
        />
      </>
    );
  }
}

export default withRouter(withTranslation()(ViewpointCreate));
