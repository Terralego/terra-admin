import React from 'react';
import InteractiveMap from 'mc-tf-test/modules/Map/InteractiveMap';
import { connectRandoProvider } from '../../services/RandoProvider';

export class Map extends React.Component {
  state = {
    map: {},
    customStyle: undefined,
  }

  componentDidMount () {
    const { getMapConfig } = this.props;
    getMapConfig();
    this.generateLayersToMap();
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

  setMap = map => {
    map.resize();
    this.setState({ map });
  }

  displayCurrentLayer = currentId => {
    const { map, customStyle: { layers = [] } = {} } = this.state;
    layers.forEach(({ id, relatedId }) => {
      if (!map.getLayer(id)) return;
      map.setLayoutProperty(id, 'visibility', relatedId === Number(currentId) ? 'visible' : 'none');
    });
  }

  generateLayersToMap () {
    const { layersList } = this.props;
    const layers = layersList.map(({ id, name }) => ({
      id: `terralego-${name}`,
      type: 'fill',
      source: 'terralego',
      relatedId: id,
      paint: { 'fill-color': '#41b6c4', 'fill-opacity': 0.4, 'fill-outline-color': 'lightblue' },
      'source-layer': name,
    }));
    this.setState({
      customStyle: {
        sources: [{
          id: 'terralego',
          type: 'vector',
          url: 'https://dev-terralego-paca.makina-corpus.net/api/layer/reference/tilejson',
        }],
        layers,
      },
    });
  }

  render () {
    const { customStyle } = this.state;
    const { mapConfig } = this.props;
    const isConfigLoaded = Object.keys(mapConfig).length > 1;

    if (!isConfigLoaded) return <div>Loading...</div>;

    return (
      <InteractiveMap
        onMapLoaded={this.setMap}
        {...mapConfig}
        customStyle={customStyle}
      />
    );
  }
}

export default connectRandoProvider('getMapConfig', 'mapConfig', 'layersList')(Map);
