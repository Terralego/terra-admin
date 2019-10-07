import React from 'react';
import PropTypes from 'prop-types';
import { NavLink, Redirect } from 'react-router-dom';
import { Icon, Button } from '@blueprintjs/core';

import { ACTION_CREATE, ACTION_UPDATE } from '../../services/CRUD';
import Loading from '../../../../components/Loading';
import { generateURI } from '../../config';
import { toast } from '../../../../utils/toast';

import Read from './Read';
import Edit from './Edit';
import './styles.scss';

class Details extends React.Component {
  static propTypes = {
    view: PropTypes.shape({}).isRequired,
    feature: PropTypes.shape({}),
    fetchFeature: PropTypes.func.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string,
        layer: PropTypes.string,
        action: PropTypes.string,
      }),
    }),
    hasError: PropTypes.bool,
    errorMessage: PropTypes.string,
    detailsHasLoaded: PropTypes.func,
    onSizeChange: PropTypes.func,
    t: PropTypes.func,
  };

  static defaultProps = {
    feature: {},
    match: {
      params: {
        id: undefined,
        layer: undefined,
        action: undefined,
      },
    },
    hasError: false,
    errorMessage: '',
    detailsHasLoaded () {},
    onSizeChange () {},
    t: text => text,
  }

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
    feature: { properties: prevProperties },
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
      feature: { properties } = {},
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
      view,
      fetchFeature,
      match: { params: { id: paramId } },
    } = this.props;
    if (view && paramId && !this.isCreateAction) {
      const { layer: { id: layerId } } = view;
      fetchFeature(layerId, paramId);
    }
  }

  setSchema = () => {
    const {
      match: { params: { id: paramId } },
      feature: { properties },
      view: { formSchema: schema = {} },
    } = this.props;
    if (Object.keys(schema).length) {
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
      view,
      feature,
    } = this.props;
    const { schema } = this.state;

    if (paramId === ACTION_CREATE || paramAction === ACTION_UPDATE) {
      return (
        <Edit
          schema={schema}
          updateControls={updateControls}
          action={paramAction || paramId}
          view={view}
        />
      );
    }
    return <Read schema={schema} view={view} feature={feature} />;
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
      errorMessage,
      full,
    } = this.props;

    if (hasError && errorMessage === 'Not Found') {
      toast.displayError(t('CRUD.details.errorNoFeature'));
      return <Redirect to={generateURI('layer', { layer: paramLayer })} />;
    }

    const isLoading = !Object.keys(feature).length && paramId !== ACTION_CREATE;

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
          {isLoading
            ? <Loading spinner />
            : this.renderContent()
          }
        </div>
      </>
    );
  }
}

export default Details;
