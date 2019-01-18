import React from 'react';
import {
  FormGroup,
  InputGroup,
  Elevation,
  Button,
  Card,
  H3,
} from '@blueprintjs/core';
import { Form, Field } from 'react-final-form';
import { withNamespaces } from 'react-i18next';

import './formeditviewpoint.scss';

export class FormEditViewpoint extends React.Component {
  state = {
    label: this.props.viewpoint.label,
  };

  handleChangeLabel = e => {
    this.setState({ label: e.target.value });
  };

  onSubmit = () => {
    const { viewpoint, fetchViewpointPut } = this.props;
    fetchViewpointPut(viewpoint.id, this.state);
  };

  render () {
    const { onSubmit, handleChangeLabel } = this;
    const { viewpoint, t } = this.props;
    const required = value => (value ? undefined : 'Requis');
    return (
      <>
        <H3>{t('opp.title.editingForm')}</H3>
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

        <H3>{t('opp.title.visualizationForm')}</H3>
        <div className="visu-edit">
          {viewpoint.pictures.map(picture => (
            <Card elevation={Elevation.TWO} key={picture.date}>
              <img src={picture.file.thumbnail} alt={viewpoint.label} />
              <p>{String(new Date(picture.date).toDateString())}</p>
            </Card>
          ))}
        </div>
      </>
    );
  }
}

export default withNamespaces()(FormEditViewpoint);
