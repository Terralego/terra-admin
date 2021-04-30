import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Redirect } from 'react-router-dom';

import Loading from '../../../../components/Loading';
import Message from '../../../../components/Message';
import DataTable from '../../components/DataTable';
import DetailsWrapper from '../../components/DetailsWrapper';
import Details from '../../components/Details';
import Map from './components/Map';

import { getFirstCrudViewName, getView } from '../../services/CRUD';
import { TABLE_MEDIUM } from '../../services/UserSettingsProvider';
import { generateURI } from '../../config';
import { toast } from '../../../../utils/toast';


import './styles.scss';

export class MapPlayground extends React.Component {
  static propTypes = {
    featureToHighlight: PropTypes.func,
    getSettings: PropTypes.func.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string,
        layer: PropTypes.string,
      }),
    }),
    settings: PropTypes.shape({}),
    settingsEndpoint: PropTypes.string,
    tableSize: PropTypes.string,
  };

  static defaultProps = {
    featureToHighlight: () => {},
    match: {
      params: {
        id: undefined,
        layer: undefined,
      },
    },
    settings: undefined,
    settingsEndpoint: undefined,
    tableSize: TABLE_MEDIUM,
  }

  state = {
    tableTransitioned: TABLE_MEDIUM,
  }

  componentDidMount () {
    const {
      getSettings,
      settingsEndpoint,
      settings,
    } = this.props;

    if (!settings) {
      getSettings(settingsEndpoint);
    }
  }

  onTableHoverCell = (featureId, hover = true) => {
    const {
      featureToHighlight,
      match: { params: { layer } },
    } = this.props;
    featureToHighlight({ layer, featureId, hover });
  }

  onTableTransitionedEnd = event => {
    event.preventDefault();
    if (event.target !== event.currentTarget) {
      return;
    }

    const {
      match: { params: { id } },
      tableSize,
    } = this.props;

    this.setState(({ tableTransitioned: prevTableTransitioned }) => {
      const nextTableTransitioned = id ? 'hidden' : tableSize;
      if (prevTableTransitioned === nextTableTransitioned) {
        return null;
      }
      return {
        tableTransitioned: nextTableTransitioned,
      };
    });
  }

  render () {
    const { tableTransitioned } = this.state;

    const {
      dataTableRef,
      detailsRef,
      settings,
      match: { params: { layer, id } },
      t,
      tableSize,
      errors,
    } = this.props;

    if (errors.settings) {
      return (
        <Message intent="danger" className="CRUD-no-settings">
          {t('CRUD.settings.unableToLoad')}
        </Message>
      );
    }

    if (!settings) {
      return <Loading spinner />;
    }

    const firstCrudViewName = getFirstCrudViewName(settings);
    const redirectArgs = firstCrudViewName ? { layer: firstCrudViewName } : {};

    if (layer && !getView(settings, layer)) {
      toast.displayError(t('CRUD.layer.errorNoLayer'));
      return <Redirect to={generateURI('layer', redirectArgs)} />;
    }
    // Redirect to the first item of the menu when no one is selected
    if (layer === undefined && firstCrudViewName) {
      return <Redirect to={generateURI('layer', redirectArgs)} />;
    }

    const areDetailsVisible = !!id;

    return (
      <>
        <DetailsWrapper detailsRef={detailsRef}>
          {areDetailsVisible && (
            <Details />
          )}
        </DetailsWrapper>

        <div
          className={classnames(
            {
              'CRUD-map': true,
              [`CRUD-map--with-table-${tableSize}`]: layer && !areDetailsVisible,
            },
          )}
        >
          <Map
            triggerFitBound={tableTransitioned}
          />
        </div>

        <div
          ref={dataTableRef}
          onTransitionEnd={this.onTableTransitionedEnd}
          className={classnames(
            {
              'CRUD-table': true,
              'CRUD-table--active': layer && !areDetailsVisible,
              [`CRUD-table--${tableSize}`]: layer && !areDetailsVisible,
            },
          )}
        >
          <DataTable
            layerName={layer}
            onHoverCell={this.onTableHoverCell}
          />
        </div>
      </>
    );
  }
}

export default MapPlayground;
