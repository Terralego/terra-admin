import React from 'react';
import PropTypes from 'prop-types';

import mapboxgl from 'mapbox-gl';
import { Map } from 'mc-tf-test';

export class InputMap extends React.Component {
  static propTypes = {
    configMap: PropTypes.shape({
      accessToken: PropTypes.string,
      backgroundStyle: PropTypes.string,
      center: PropTypes.arrayOf(PropTypes.number),
      maxBounds: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.array), PropTypes.bool]),
    }),
    value: PropTypes.arrayOf(PropTypes.number),
    onChange: PropTypes.func,
  };

  static defaultProps = {
    configMap: {},
    value: [],
    onChange () {
    },
  };

  initMap = map => {
    const { onChange, value } = this.props;
    const marker = new mapboxgl.Marker();

    if (value) {
      marker.setLngLat({ lng: value[0], lat: value[1] });
    }

    map.on('click', ({ lngLat: { lng, lat } = {} }) => {
      onChange([lng, lat]);
      marker.setLngLat({ lng, lat });
    });

    marker.addTo(map);
  };

  render () {
    const { configMap } = this.props;
    return (
      <div className="input-map">
        <Map
          {...configMap}
          onMapLoaded={this.initMap}
        />
      </div>
    );
  }
}

export default (InputMap);
