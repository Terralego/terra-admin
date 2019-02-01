import React from 'react';

import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';


import './input-map.scss';

mapboxgl.accessToken = 'pk.eyJ1IjoibWFraW5hY29ycHVzIiwiYSI6ImNqY3E4ZTNwcTFta3ozMm80d2xzY29wM2MifQ.Nwl_FHrWAIQ46s_lY0KNiQ';

export class InputMap extends React.Component {
  containerEl = React.createRef();

  componentDidMount () {
    this.map = new mapboxgl.Map({
      container: this.containerEl.current,
      style: 'mapbox://styles/mapbox/streets-v9',
      center: [-61.0134945, 14.6376395],
      zoom: 10,
      minZoom: 6,
      maxZoom: 17,
      maxBounds: [[-62.2, 14.1], [-60.1, 15.0]],
    });

    const Draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        point: true,
        trash: true,
      },
    });

    this.map.addControl(Draw, 'top-left');

    this.onlyOnePoint(Draw);
  }

  onlyOnePoint = Draw => {
    const currentComponent = this;
    this.map.on('draw.modechange', () => {
      let idPointToDelete = '';
      let currentDraw = '';
      const allGeometry = Draw.getAll();
      currentDraw = allGeometry.features[allGeometry.features.length - 1];
      currentComponent.props.onCoordinate(currentDraw);
      if (Draw.getMode() === 'draw_point') {
        allGeometry.features.forEach(geometry => {
          if (geometry.geometry.type === 'Point' && geometry.id !== currentDraw.id) {
            idPointToDelete = geometry.id;
          }
        });
        Draw.delete(idPointToDelete);
      }
    });
  };

  render () {
    return (
      <div className="input-map">
        <div
          id="containerEl"
          ref={this.containerEl}
          style={{ width: 'auto', height: '80vh' }}
        />

      </div>
    );
  }
}

export default (InputMap);
