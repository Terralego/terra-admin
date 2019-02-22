import React from 'react';
import InteractiveMap from 'mc-tf-test/modules/Map/InteractiveMap';

export class Map extends React.Component {
  componentDidUpdate ({ match: { params: { id: prevId } } }) {
    const { match: { params: { id } } } = this.props;
    if (id !== prevId) {
      // TODO display Style related to layerID
    }
  }

  setMap = map => {
    map.resize();
  }

  render () {
    const map = {
      accessToken: 'pk.eyJ1IjoibWFraW5hY29ycHVzIiwiYSI6ImNqY3E4ZTNwcTFta3ozMm80d2xzY29wM2MifQ.Nwl_FHrWAIQ46s_lY0KNiQ',
      backgroundStyle: [
        { label: 'clair', url: 'mapbox://styles/makinacorpus/cjpdvdqdj0b7a2slajmjqy3py' },
      ],
      center: [5.386195159396806, 43.30072210972415],
      zoom: 9,
      maxZoom: 16,
      minZoom: 7,
      fitBounds: [[4.2301364, 42.9822468], [7.7184776, 45.1266002]],
    };

    return (
      <InteractiveMap
        onMapLoaded={this.setMap}
        {...map}
      />
    );
  }
}

export default Map;
