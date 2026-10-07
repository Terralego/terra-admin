import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// jsdom n'a ni TextDecoder ni WebGL : importer maplibre suffit à faire échouer
// la suite, il faut donc le remplacer entièrement.
vi.mock('maplibre-gl', () => {
  function Map () {
    this.addControl = () => {};
    this.once = () => {};
    this.on = () => {};
    this.off = () => {};
    this.setStyle = () => {};
    this.setCenter = () => {};
    this.setZoom = () => {};
    this.fitBounds = () => {};
    this.resize = () => {};
    this.remove = () => {};
  }
  function Marker () {
    this.setLngLat = () => this;
    this.addTo = () => this;
    this.remove = () => {};
  }
  function NavigationControl () {}

  return { Map, Marker, NavigationControl, setWorkerUrl: () => {} };
});


it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});
