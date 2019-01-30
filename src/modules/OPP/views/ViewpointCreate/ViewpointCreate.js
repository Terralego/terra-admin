import React from 'react';
import {
  H3,
} from '@blueprintjs/core';
import { withNamespaces } from 'react-i18next';
import {  Form } from 'react-final-form';
import { withRouter } from 'react-router-dom';

import { validateCreate } from './validateCreateForm';
import FormCreate from './FormCreate';

export class ViewpointCreate extends React.Component {
  state = {
    picture: {
      pictureFile: {},
    },
  };

  onSubmit = async values => {
    const { saveViewpointAction, history } = this.props;
    const { picture } = this.state;
    const data = { ...values, ...picture };
    console.log(data);
    // await saveViewpointAction(data);
    // const { viewpoints: { newViewpoint: { id } } } = this.props;
    // history.push(`${id}`);
  };

  onPicture = (file) => {
    this.setState({ picture: { pictureFile: file } });
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
          render={({ handleSubmit, invalid, form }) => (
            <FormCreate
              handleSubmit={handleSubmit}
              invalid={invalid}
              form={form}
              onPicture={onPicture}
            />
          )}
        />
      </>
    );
  }
}

export default withRouter(withNamespaces()(ViewpointCreate));
