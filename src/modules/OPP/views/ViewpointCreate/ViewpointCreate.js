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
    pictureFile: {},
  };

  onSubmit = async values => {
    const { saveViewpointAction, history } = this.props;
    const { pictureFile } = this.state;
    const data = { ...values, pictureFile };
    const newViewpoint = await saveViewpointAction(data);
    const { id } = newViewpoint;
    history.push(`${id}`);
  };

  onPicture = file => {
    this.setState({ pictureFile: file });
  };

  onCoordinate = point => {
    if (point.geometry.coordinates.length > 0) {
      this.setState({
        point: {
          longitude: point.geometry.coordinates[0],
          latitude: point.geometry.coordinates[1],
        },
      });
    }
  };

  render () {
    const {
      onSubmit,
      onPicture,
      onCoordinate,
    } = this;
    const { t } = this.props;
    const { point } = this.state;
    return (
      <>
        <H3>{t('opp.viewpoint.create.title')}</H3>
        <Form
          onSubmit={onSubmit}
          validate={validateCreate}
          initialValues={point}
          render={formProps => (
            <FormCreate
              {...formProps}
              onPicture={onPicture}
              onCoordinate={onCoordinate}
            />
          )}
        />
      </>
    );
  }
}

export default withRouter(withNamespaces()(ViewpointCreate));
