
const mockedCustomStyle = {
  sources: [
    {
      id: 'terralego-chemins',
      type: 'vector',
      url: 'http://acir.geotrek.ovh/api/layer/chemins/tilejson',
    },
    {
      id: 'terralego-biens',
      type: 'vector',
      url: 'http://acir.geotrek.ovh/api/layer/biens/tilejson',
    },
  ],
  layers: [
    {
      id: 'terralego-chemins',
      type: 'line',
      source: 'terralego-chemins',
      paint: {
        'line-color': 'lightblue',
        'line-width': 3,
      },
      'source-layer': 'chemins',
    },
    {
      id: 'terralego-biens',
      type: 'circle',
      source: 'terralego-biens',
      paint: {
        'circle-color': 'pink',
        'circle-radius': 10,
      },
      'source-layer': 'biens',
    },
  ],
};

export default mockedCustomStyle;
