import React from 'react';
import { NavLink, Redirect } from 'react-router-dom';
import { Icon, Button } from '@blueprintjs/core';

import { ACTION_CREATE, ACTION_UPDATE } from '../../views/Map/Map';
import Loading from '../../../../components/Loading';
import { generateURI } from '../../config';
import { toast } from '../../../../utils/toast';

import Read from './Read';
import Edit from './Edit';
import './styles.scss';

class Details extends React.Component {
  state = {
    schema: {},
  }

  detailContent = React.createRef();

  componentDidMount () {
    const {
      match: { params: { id: paramId } },
      detailsHasLoaded,
    } = this.props;
    this.getData();
    this.setSchema();
    if (paramId === ACTION_CREATE) {
      detailsHasLoaded();
    }
  }

  componentDidUpdate ({
    match: {
      params: {
        action: prevParamAction,
        id: prevParamId,
        layer: prevParamlayer,
      },
    },
    feature: prevFeature,
    feature: {
      [prevParamId]: {
        properties: prevProperties,
      } = {},
    } = {},
  }) {
    const {
      match: {
        params: {
          action: paramAction,
          id: paramId,
          layer: paramLayer,
        },
      },
      feature,
      feature: { [paramId]: { properties } = {} } = {},
      detailsHasLoaded,
    } = this.props;

    if (feature !== prevFeature) {
      detailsHasLoaded();
    }

    if (prevParamlayer !== paramLayer || prevParamId !== paramId) {
      this.getData();
    }

    if (
      properties !== prevProperties
      || prevParamId !== paramId
      || prevParamAction !== paramAction
    ) {
      this.setSchema();
    }
  }

  get isCreateAction () {
    const { match: { params: { id: paramId } } } = this.props;
    return paramId === ACTION_CREATE;
  }

  getData () {
    const {
      layer,
      fetchFeature,
      match: { params: { id: paramId } },
    } = this.props;
    if (layer && paramId && !this.isCreateAction) {
      const { id: layerId } = layer;
      fetchFeature(layerId, paramId);
    }
  }

  setSchema = () => {
    const {
      match: { params: { id: paramId } },
      feature: { [paramId]: { properties } = {} } = {},
      layer: { schema = {} } = {},
    } = this.props;
    if (Object.keys(schema).length > 0) {
      this.setState({
        schema: {
          type: 'object',
          ...schema,
          properties: Object.keys(schema.properties).reduce((list, prop) => ({
            ...list,
            [prop]: {
              ...schema.properties[prop],
              ...(properties && paramId !== ACTION_CREATE)
                ? { default: properties[prop] }
                : {},
            },
          }), {}),
        },
      });
    }
  }

  renderContent = () => {
    const {
      match: { params: { action: paramAction, id: paramId } },
      updateControls,
    } = this.props;
    const { schema } = this.state;

    if (paramId === ACTION_CREATE || paramAction === ACTION_UPDATE) {
      return (
        <Edit
          schema={schema}
          updateControls={updateControls}
          action={paramAction || paramId}
        />
      );
    }
    return <Read schema={schema} />;
  }

  onSizeChange = () => {
    const { full, onSizeChange } = this.props;
    onSizeChange({ full: !full });
  }

  render () {
    const {
      feature,
      match: { params: { id: paramId, layer: paramLayer } },
      t,
      hasError,
      errorCode,
      full,
    } = this.props;

    if (hasError && errorCode === 'Not Found') {
      toast.displayError(t('CRUD.details.errorNoFeature'));
      return <Redirect to={generateURI('layer', { layer: paramLayer })} />;
    }

    return (
      <>
        <div className="CRUD-details__actions">
          <Button
            minimal
            icon={full ? 'minimize' : 'maximize'}
            onClick={this.onSizeChange}
          />
          <NavLink to={generateURI('layer', { layer: paramLayer })}>
            <span className="bp3-button bp3-minimal">
              <Icon icon="cross" title={t('CRUD.details.close')} />
            </span>
          </NavLink>
        </div>
        <div ref={this.detailContent} className="CRUD-details__content">
          {!feature && paramId !== ACTION_CREATE ? (
            <Loading spinner />
          ) : (
            <>{this.renderContent()}</>
          )}
        </div>
      </>
    );
  }
}

export default Details;
