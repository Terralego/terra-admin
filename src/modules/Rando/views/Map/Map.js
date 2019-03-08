import React from 'react';
import InteractiveMap from 'mc-tf-test/modules/Map/InteractiveMap';
import { connectRandoProvider } from '../../services/RandoProvider';
import mockedCustomStyle from './mockedCustomStyle';

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

  displayCurrentLayer = currentPath => {
    const { map, customStyle: { layers = [] } = {} } = this.state;
    layers.forEach(({ id, 'source-layer': sourceLayer }) => {
      if (!map.getLayer(id)) return;
      map.setLayoutProperty(id, 'visibility', sourceLayer === currentPath ? 'visible' : 'none');
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
