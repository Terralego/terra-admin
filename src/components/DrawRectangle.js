import DrawRectangle from 'mapbox-gl-draw-rectangle-mode';

/**
 * Override some methods to stay in draw_rectangle mode
 */

/* eslint-disable func-names, no-param-reassign */

DrawRectangle.onClick = function (state, e) {
  // if state.startPoint exist, means its second click
  // change to  simple_select mode
  if (
    state.startPoint &&
      state.startPoint[0] !== e.lngLat.lng &&
      state.startPoint[1] !== e.lngLat.lat
  ) {
    this.updateUIClasses({ mouse: 'pointer' });
    state.endPoint = [e.lngLat.lng, e.lngLat.lat];
    this.changeMode('draw_rectangle', { featuresId: state.rectangle.id });
  }
  // on first click, save clicked point coords as starting for  rectangle
  const startPoint = [e.lngLat.lng, e.lngLat.lat];
  state.startPoint = startPoint;
};

DrawRectangle.onTrash = function (state) {
  this.deleteFeature([state.rectangle.id], { silent: true });
};


export default DrawRectangle;
