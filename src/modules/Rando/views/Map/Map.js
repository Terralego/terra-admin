import React from 'react';
import classnames from 'classnames';
import InteractiveMap from 'mc-tf-test/modules/Map/InteractiveMap';

import DataTable from '../../components/DataTable';
import { connectRandoProvider } from '../../services/RandoProvider';
import mockedCustomStyle from './mockedCustomStyle';

import './styles.scss';

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

  generateLayersToMap () {
    this.setState({
      customStyle: {
        ...mockedCustomStyle,
      },
    });
  }

  render () {
    const { customStyle } = this.state;
    const { mapConfig, mapIsResizing, match: { params: { id = false } } } = this.props;
    const isConfigLoaded = Object.keys(mapConfig).length > 1;

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
