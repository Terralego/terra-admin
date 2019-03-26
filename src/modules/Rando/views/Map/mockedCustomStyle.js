
const mockedCustomStyle = {
  sources: [
    {
      id: 'terralego',
      type: 'vector',
      url: '/api/layer/reference/tilejson',
    },
  ],
  layers: [
    {
      id: 'terralego-chemins',
      type: 'line',
      source: 'terralego',
      paint: {
        'line-color': 'lightblue',
        'line-width': 3,
      },
      'source-layer': 'chemins',
    },
    {
      id: 'terralego-biens',
      type: 'circle',
      source: 'terralego',
      paint: {
        'circle-color': 'pink',
        'circle-radius': 10,
      },
      'source-layer': 'biens',
    },
    {
      id: 'terralego-tampon',
      type: 'fill',
      source: 'terralego',
      paint: {
        'fill-color': 'salmon',
      },
      'source-layer': 'tampon',
    },
    {
      id: 'terralego-biens_polygon',
      type: 'fill',
      source: 'terralego',
      paint: {
        'fill-color': 'lightgreen',
      },
      'source-layer': 'biens_polygon',
    },
  ],
};

export default mockedCustomStyle;
