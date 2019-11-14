import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Redirect } from 'react-router-dom';
import InteractiveMap, { INTERACTION_FN } from '@terralego/core/modules/Map/InteractiveMap';
import { DEFAULT_CONTROLS, CONTROL_CAPTURE, CONTROLS_TOP_RIGHT } from '@terralego/core/modules/Map';

import Loading from '../../../../components/Loading';
import Message from '../../../../components/Message';
import DataTable from '../../components/DataTable';
import DetailsWrapper from '../../components/DetailsWrapper';
import Details from '../../components/Details';
import { getBounds } from '../../services/features';
import { ACTION_CREATE, ACTION_UPDATE, getView, getSources, getLayersPaints, getFirstCrudViewName } from '../../services/CRUD';
import { generateURI } from '../../config';
import { toast } from '../../../../utils/toast';

import './styles.scss';

export const CONTROL_CAPTURE_POSITION = {
  control: CONTROL_CAPTURE,
  position: CONTROLS_TOP_RIGHT,
};

const isTrueFeatureID = id => ![undefined, ACTION_CREATE].includes(id);

export class Map extends React.Component {
  static propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func,
    }).isRequired,
    getSettings: PropTypes.func.isRequired,
    setMap: PropTypes.func.isRequired,
    displayViewFeature: PropTypes.bool,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string,
        layer: PropTypes.string,
      }),
    }),
    settings: PropTypes.shape({}),
    settingsEndpoint: PropTypes.string,
    map: PropTypes.shape({}),
    feature: PropTypes.shape({}),
  };

  static defaultProps = {
    displayViewFeature: true,
    match: {
      params: {
        id: undefined,
        layer: undefined,
      },
    },
    map: {},
    settings: undefined,
    settingsEndpoint: undefined,
    feature: {},
  }

  state = {
    mapConfig: {},
    interactions: [],
    customStyle: {},
    controls: [...DEFAULT_CONTROLS, CONTROL_CAPTURE_POSITION],
    tableSize: 'medium', // 'minified', 'medium', 'full'
  }

  details = React.createRef();

  dataTable = React.createRef();

  componentDidMount () {
    const { getSettings, settingsEndpoint } = this.props;
    getSettings(settingsEndpoint);
    this.generateLayersToMap();
    this.setInteractions();
  }

  componentDidUpdate ({
    map: prevMap,
    settings: prevSettings,
    match: { params: { layer: prevLayer, id: prevId, action: prevAction } },
    feature: { geom: { coordinates: prevCoordinates } = {} },
  }) {
    const {
      settings,
      match: { params: { layer, id, action } },
      map,
      feature: { geom: { coordinates } = {} },
    } = this.props;

    const { customStyle: { layers = [] }, addHighlight, removeHighlight } = this.state;

    if (settings !== prevSettings) {
      this.generateLayersToMap();
    }

    if (settings !== prevSettings || action !== prevAction || prevId !== id) {
      this.setInteractions();
    }

    if (layer !== prevLayer || map !== prevMap) {
      this.displayCurrentLayer();
    }

    if (layer && (prevId !== id || layer !== prevLayer || map !== prevMap)) {
      this.setFitBounds();
    }

    if (isTrueFeatureID(id) && prevCoordinates !== coordinates) {
      this.setFitBounds();
      if (action !== ACTION_UPDATE) {
        const { id: layerId, source } = layers.find(({ 'source-layer': sourceLayer }) => sourceLayer === layer) || {};
        if (!layerId || !Object.keys(map).length) {
          return;
        }
        addHighlight({
          layerId,
          featureId: id,
          highlightColor: 'red',
          unique: true,
          source,
        });
      }
    }

    if ((isTrueFeatureID(prevId) && !id) || action === ACTION_UPDATE) {
      const { id: layerId } = layers.find(({ 'source-layer': sourceLayer }) => sourceLayer === prevLayer) || {};
      if (!layerId) {
        return;
      }
      removeHighlight && removeHighlight({
        layerId,
        featureId: prevId,
      });
    }
  }

  setInteractions = () => {
    const {
      match: { params: { id, action } },
      history: { push },
      displayViewFeature,
      settings,
    } = this.props;

    if (!displayViewFeature) {
      return;
    }

    const layers = getLayersPaints(settings);

    const interactions = layers.map(interaction => {
      if (action === ACTION_UPDATE || id === ACTION_CREATE) {
        return interaction;
      }
      return {
        ...interaction,
        interaction: INTERACTION_FN,
        fn: ({
          feature: { sourceLayer, properties: { _id: propId } },
        }) => {
          push(generateURI('layer', { layer: sourceLayer, id: propId }));
        },
      };
    });

    this.setState({
      interactions,
    });
  }

  setFitBounds = ({ duration = 0 } = {}) => {
    const {
      map,
      match: { params: { layer, id } },
      settings,
      feature: { geom: { coordinates = [] } = {} },
    } = this.props;

    if (!Object.keys(map).length) return;

    const { extent: [w, s, e, n] } = getView(settings, layer);
    const coords = isTrueFeatureID(id) ? coordinates : [[w, s], [e, n]];

    if (!coords.length) return;

    const { current: detail } = this.details;
    const { current: dataTable } = this.dataTable;

    setTimeout(() => {
      const padding = {
        top: 20,
        right: (id && detail) ? (detail.offsetWidth + 50) : 50,
        bottom: !id ? (dataTable.offsetHeight + 20) : 20,
        left: 20,
      };
      map.resize();
      map.fitBounds(getBounds(coords), { padding, duration });
    }, 500);
  }

  resetMap = map => {
    const { setMap } = this.props;
    setMap(map);
    map.resize();
  }

  interactiveMapInit = ({ addHighlight, removeHighlight }) => {
    this.setState({
      addHighlight,
      removeHighlight,
    });
  }

  displayCurrentLayer = () => {
    const {
      map,
      match: { params: { layer } },
    } = this.props;
    const { customStyle: { layers = [] } } = this.state;
    if (!Object.keys(map).length || !layers.length) {
      return;
    }
    layers.forEach(({ id, 'source-layer': sourceLayer }) => {
      if (!map.getLayer(id)) return;
      map.setLayoutProperty(id, 'visibility', sourceLayer === layer ? 'visible' : 'none');
    });
  }

  updateControls = controls => this.setState({
    controls: [...controls, ...DEFAULT_CONTROLS, CONTROL_CAPTURE_POSITION],
  })

  onTableSizeChange = tableSize => {
    this.setState({ tableSize });
    if (tableSize !== 'full') {
      this.setFitBounds();
    }
  }

  onTableHoverCell = (featureId, hover = true) => {
    const { match: { params: { layer } } } = this.props;
    const { customStyle: { layers = [] }, addHighlight, removeHighlight } = this.state;
    const { id: layerId, source } = layers.find(({ 'source-layer': sourceLayer }) => sourceLayer === layer) || {};
    if (!layerId) {
      return;
    }
    if (hover) {
      addHighlight({
        layerId,
        featureId,
        highlightColor: 'red',
        unique: true,
        source,
      });
    } else {
      removeHighlight({
        layerId,
        featureId,
      });
    }
  }

  generateLayersToMap () {
    const { settings } = this.props;

    if (!Object.keys(settings).length) {
      return;
    }

    const {
      config: {
        default: {
          map = {},
        } = {},
      } = {},
    } = settings;

    const mapConfig = Object.keys(map).reduce((keys, mapKey) => {
      if (mapKey === 'mapbox_access_token') {
        return { ...keys, accessToken: map[mapKey] };
      }
      if (mapKey === 'background_styles') {
        return { ...keys, backgroundStyle: map[mapKey] };
      }
      return { ...keys, [mapKey]: map[mapKey] };
    }, {});

    this.setState({
      customStyle: {
        sources: getSources(settings),
        layers: getLayersPaints(settings),
      },
      mapConfig,
    });
  }

  render () {
    const { customStyle, interactions, controls, tableSize, mapConfig } = this.state;
    const {
      mapIsResizing,
      settings,
      match: { params: { layer, id } },
      t,
      errors,
    } = this.props;

    if (errors.settings) {
      return (
        <Message intent="danger" className="CRUD-no-settings">
          {t('CRUD.settings.unableToLoad')}
        </Message>
      );
    }


    const areSettingsLoaded = Object.keys(settings).length && Object.keys(mapConfig).length;
    const areDetailsVisible = !!id;

    if (areSettingsLoaded) {
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
    }

    return (
      <>
        {!areSettingsLoaded
          ? <Loading spinner />
          : (
            <>
              <DetailsWrapper detailsRef={this.details}>
                {areDetailsVisible && (
                  <Details
                    updateControls={this.updateControls}
                  />
                )}
              </DetailsWrapper>
              <div
                ref={this.dataTable}
                className={classnames(
                  {
                    'CRUD-table': true,
                    'CRUD-table--active': layer && !areDetailsVisible,
                    [`CRUD-table--${tableSize}`]: layer && !areDetailsVisible,
                  },
                )}
              >
                <DataTable
                  onTableSizeChange={this.onTableSizeChange}
                  tableSize={tableSize}
                  layerName={layer}
                  onHoverCell={this.onTableHoverCell}
                />
              </div>

              <div
                className={classnames(
                  'CRUD-map',
                  { 'CRUD-map--is-resizing': mapIsResizing },
                )}
              >
                <InteractiveMap
                  onMapLoaded={this.resetMap}
                  {...mapConfig}
                  customStyle={customStyle}
                  interactions={interactions}
                  controls={controls}
                  onInit={this.interactiveMapInit}
                />
              </div>
            </>
          )}
      </>
    );
  }
}

export default Map;
