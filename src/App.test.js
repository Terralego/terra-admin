import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

jest.mock('jsoneditor-react', () => ({}));
jest.mock('react-mapbox-gl', () => ({
  __esModule: true, // this property makes it work
  default: () => ({}),
  Marker: () => ({}),
}));

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});
