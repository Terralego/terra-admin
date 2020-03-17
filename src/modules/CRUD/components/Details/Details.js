import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';

import { ACTION_CREATE, ACTION_UPDATE } from '../../services/CRUD';
import Loading from '../../../../components/Loading';
import { generateURI } from '../../config';
import { toast } from '../../../../utils/toast';

import Metas from './Metas';
import Read from './Read';
import Edit from './Edit';
import './styles.scss';

class Details extends React.Component {
  static propTypes = {
    view: PropTypes.shape({
      featureEndpoint: PropTypes.string,
    }),
    feature: PropTypes.shape({
      properties: PropTypes.shape({}),
    }),
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
    view: {
      featureEndpoint: undefined,
    },
    feature: {
      properties: {},
    },
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

  detailContent = React.createRef();

  componentDidMount () {
    const {
      match: { params: { id: paramId } },
      detailsHasLoaded,
    } = this.props;
    this.getData();
    if (paramId === ACTION_CREATE) {
      detailsHasLoaded();
    }
  }

  componentDidUpdate ({
    match: {
      params: {
        id: prevParamId,
        layer: prevParamlayer,
      },
    },
    feature: prevFeature,
  }) {
    const {
      match: {
        params: {
          id: paramId,
          layer: paramLayer,
        },
      },
      feature,
      detailsHasLoaded,
    } = this.props;

    if (feature !== prevFeature) {
      detailsHasLoaded();
    }

    if (prevParamlayer !== paramLayer || prevParamId !== paramId) {
      this.getData();
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
      const { featureEndpoint } = view;
      fetchFeature(featureEndpoint, paramId);
    }
  }

  renderContent = () => {
    const {
      match: { params: { action: paramAction, id: paramId } },
      feature,
      refreshingLayers,
    } = this.props;

    if (paramId === ACTION_CREATE || paramAction === ACTION_UPDATE) {
      return (
        <Edit
          action={paramAction || paramId}
          refreshingLayers={refreshingLayers}
        />
      );
    }
    return (
      <Read feature={feature} />
    );
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
        <Metas
          full={full}
          onSizeChange={this.onSizeChange}
        />
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
