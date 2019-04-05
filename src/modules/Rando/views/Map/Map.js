import React from 'react';
import classnames from 'classnames';
import InteractiveMap, { INTERACTION_FN } from 'mc-tf-test/modules/Map/InteractiveMap';

import DataTable from '../../components/DataTable';
import Details from '../../components/Details';
import { connectRandoProvider } from '../../services/RandoProvider';
import mockedCustomStyle from './mockedCustomStyle';
import mockedInteraction from './mockedInteraction';

import './styles.scss';

export const INTERACTION_DISPLAY_DETAILS = 'displayDetails';
export class Map extends React.Component {
  state = {
    map: {},
    interactions: [],
    customStyle: undefined,
    details: undefined,
  }

  componentDidMount () {
    const { getMapConfig } = this.props;
    getMapConfig();
    this.generateLayersToMap();
    this.setInteractions();
  }

  componentDidUpdate (
    { layersList: prevLayersList, match: { params: { id: prevId } } },
    { map: prevMap },
  ) {
    const {
      layersList,
      match: { params: { id } },
    } = this.props;
    const { map } = this.state;
    if (layersList !== prevLayersList) {
      this.generateLayersToMap();
    }
    if (id !== prevId || map !== prevMap) {
      this.displayCurrentLayer(id);
    }
  }

  setInteractions () {
    const { interactions = [] } = mockedInteraction;
    const newInteractions = interactions.map(interaction => {
      if (interaction.interaction === INTERACTION_DISPLAY_DETAILS) {
        return {
          ...interaction,
          interaction: INTERACTION_FN,
          fn: ({ feature }) => {
            this.displayDetails(feature, interaction);
          },
        };
      }
      return interaction;
    });
    this.setState({
      interactions: newInteractions,
    });
  }

  resetMap = map => {
    const { setMap } = this.props;
    setMap(map);
    map.resize();
    this.setState({ map });
  }

  displayCurrentLayer = currentPath => {
    const { map, customStyle: { layers = [] } = {} } = this.state;
    layers.forEach(({ id, 'source-layer': sourceLayer }) => {
      if (!map.getLayer(id)) return;
      map.setLayoutProperty(id, 'visibility', sourceLayer === currentPath ? 'visible' : 'none');
    });
  }

  hideDetails = () => {
    this.setState({ details: undefined });
  }

  displayDetails (feature, interaction) {
    this.setState({
      details: {
        feature,
        interaction,
      },
    });
  }

  generateLayersToMap () {
    this.setState({
      customStyle: {
        ...mockedCustomStyle,
      },
    });
  }


  render () {
    const { customStyle, details, interactions } = this.state;
    const { mapConfig, mapIsResizing, match: { params: { id = false } } } = this.props;
    const isConfigLoaded = Object.keys(mapConfig).length > 1;
    const isDetailsVisible = !!details;

    if (!isConfigLoaded) return <div>Loading...</div>;

    return (
      <div
        className={classnames(
          'rando-map',
          { 'rando-map--is-resizing': mapIsResizing },
        )}

      >
        <div className="rando-map__map">
          <InteractiveMap
            onMapLoaded={this.resetMap}
            {...mapConfig}
            customStyle={customStyle}
            interactions={interactions}
          />
          <Details
            visible={isDetailsVisible}
            {...details}
            onClose={this.hideDetails}
          />
        </div>
        <div
          className={classnames(
            'rando-map__table',
            { 'rando-map__table--active': id },
          )}
        >
          <DataTable
            source={id}
          />
        </div>
      </div>
    );
  }
}

export default connectRandoProvider('getMapConfig', 'mapConfig', 'layersList', 'setMap', 'mapIsResizing')(Map);
