import React from 'react';
import {
  FormGroup,
  InputGroup,
  Elevation,
  Button,
  Card,
  H3,
} from '@blueprintjs/core';

import './formeditviewpoint.scss';

export class FormEditViewpoint extends React.Component {
  state = {
    label: '',
  };

  handleChangeLabel = e => {
    this.setState({ label: e.target.value });
  };

  handleSubmit = async e => {
    e.preventDefault();

    const { viewpoint, fetchViewpointPut } = this.props;

    try {
      fetchViewpointPut(viewpoint.id, this.state);
    } catch (errors) {
      console.error(errors);
    }
  };

  render () {
    const { viewpoint } = this.props;
    return (
      <>
        <H3>Formulaire d'édition</H3>
        <form method="put" onSubmit={this.handleSubmit} className="form-edit">
          <FormGroup>
            <InputGroup
              leftIcon="tag"
              onChange={this.handleChangeLabel}
              defaultValue={viewpoint.label}
            />
          </FormGroup>
          <Button text="Envoyer" type="submit" />
        </form>
        <H3>Visualisation des images</H3>
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

export default FormEditViewpoint;
