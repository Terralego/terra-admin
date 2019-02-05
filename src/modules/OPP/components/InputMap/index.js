import React from 'react';
import PropTypes from 'prop-types';

import mapboxgl from 'mc-tf-test/node_modules/mapbox-gl';
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

  state = {
    marker: null,
  };

  componentDidUpdate () {
    const { marker } = this.state;
    if (marker) {
      const { value } = this.props;
      marker.setLngLat(value);
    }
  }

  initMap = map => {
    this.setState({ marker: new mapboxgl.Marker() });

    const { marker } = this.state;
    const { onChange } = this.props;

    marker.addTo(map);

    map.on('click', e => {
      onChange([e.lngLat.lng, e.lngLat.lat]);
      marker.setLngLat(e.lngLat);
    });
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
