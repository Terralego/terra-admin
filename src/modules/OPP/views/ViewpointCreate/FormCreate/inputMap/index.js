import React from 'react';
import PropTypes from 'prop-types';

import MapboxDraw from '@mapbox/mapbox-gl-draw';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import { Map } from 'mc-tf-test';

import './input-map.scss';

export class InputMap extends React.Component {
  static propTypes = {
    value: PropTypes.arrayOf(PropTypes.number),
    onChange: PropTypes.func,
  };

  static defaultProps = {
    value: [],
    onChange () {},
  };

  // Todo : Refacto
  onlyOnePoint = (map, Draw) => {

    map.on('draw.modechange', () => {
      let idPointToDelete = '';
      const allGeometry = Draw.getAll();
      const { onChange } = this.props;
      const currentDraw = allGeometry.features[allGeometry.features.length - 1];
      if (Draw.getMode() === 'draw_point') {
        allGeometry.features.forEach(geometry => {
          if (geometry.geometry.type === 'Point' && geometry.id !== currentDraw.id) {
            idPointToDelete = geometry.id;
          }
        });
        Draw.delete(idPointToDelete);
      }
      onChange(currentDraw.geometry.coordinates);
    });

    map.on('draw.delete', () => {
      const { onChange } = this.props;
      Draw.trash();
      onChange(null);
    });
  };

  addToolsDraw = map => {
    const Draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        point: true,
        trash: true,
      },
      styles: [
        {
          id: 'highlight-active-points',
          type: 'circle',
          filter: ['all',
            ['==', '$type', 'Point'],
            ['==', 'meta', 'feature'],
            ['==', 'active', 'true']],
          paint: {
            'circle-radius': 7,
            'circle-color': '#64855f',
          },
        },
        {
          id: 'input',
          type: 'circle',
          filter: ['all',
            ['==', '$type', 'Point'],
            ['==', 'meta', 'feature'],
            ['==', 'active', 'false']],
          paint: {
            'circle-radius': 6,
            'circle-color': '#429415',
            'circle-stroke-width': 2,
            'circle-stroke-color': '#333',
          },
        },
      ],
    });

    map.addControl(Draw, 'top-left');

    const { value: [longitude, latitude] } = this.props;

    if (longitude && latitude) {
      Draw.set({
        type: 'FeatureCollection',
        features: [{
          type: 'Feature',
          properties: {},
          id: 'input',
          geometry: { type: 'Point', coordinates: [longitude, latitude] },
        }],
      });
    }

    this.onlyOnePoint(map, Draw);
  };

  initMap = map => {
    this.addToolsDraw(map);
  };

  render () {
    return (
      <div className="input-map" >
        <Map
          accessToken="pk.eyJ1IjoibWFraW5hY29ycHVzIiwiYSI6ImNqY3E4ZTNwcTFta3ozMm80d2xzY29wM2MifQ.Nwl_FHrWAIQ46s_lY0KNiQ"
          backgroundStyle="mapbox://styles/mapbox/streets-v9"
          center={[-61.0134945, 14.6376395]}
          zoom={10}
          minZoom={6}
          maxZoom={17}
          maxBounds={[[-62.2, 14.1], [-60.1, 15.0]]}
          onMapLoaded={this.initMap}
        />
      </div>
    );
  }
}

export default (InputMap);
