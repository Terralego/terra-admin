import React from 'react';

import MapboxDraw from '@mapbox/mapbox-gl-draw';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import { Map } from 'mc-tf-test';

import './input-map.scss';

export class InputMap extends React.Component {
  onlyOnePoint = (map, Draw) => {
    const currentComponent = this;

    map.on('draw.modechange', () => {
      let idPointToDelete = '';
      let currentDraw = '';
      const allGeometry = Draw.getAll();
      currentDraw = allGeometry.features[allGeometry.features.length - 1];
      if (Draw.getMode() === 'draw_point') {
        allGeometry.features.forEach(geometry => {
          if (geometry.geometry.type === 'Point' && geometry.id !== currentDraw.id) {
            idPointToDelete = geometry.id;
          }
        });
        Draw.delete(idPointToDelete);
      }
      currentComponent.props.form.change('longitude', currentDraw.geometry.coordinates[0]);
      currentComponent.props.form.change('latitude', currentDraw.geometry.coordinates[1]);
    });

    map.on('draw.delete', () => {
      Draw.trash();
      currentComponent.props.form.change('longitude', null);
      currentComponent.props.form.change('latitude', null);
    });
  };

  addToolsDraw = map => {
    const { form } = this.props;

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
            'circle-color': '#223947',
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
            'circle-radius': 5,
            'circle-color': '#223947',
          },
        },
      ],
    });

    map.addControl(Draw, 'top-left');

    if (form.getFieldState('longitude').value && form.getFieldState('latitude').value) {
      Draw.set({
        type: 'FeatureCollection',
        features: [{
          type: 'Feature',
          properties: {},
          id: 'input',
          geometry: { type: 'Point', coordinates: [+form.getFieldState('longitude').value, +form.getFieldState('latitude').value] },
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
      <div className="input-map">
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
