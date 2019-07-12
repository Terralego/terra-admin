
const mockedCustomStyle = {
  sources: [
    {
      id: 'reference',
      type: 'vector',
      url: '/api/layer/Référence/tilejson',
    },
    {
      id: 'infoTourism',
      type: 'vector',
      url: '/api/layer/Accueil information tourisme/tilejson',
    },
    {
      id: 'culture',
      type: 'vector',
      url: '/api/layer/Médiation actions culturelles/tilejson',
    },
  ],
  layers: [
    {
      id: 'terralego-chemins',
      type: 'line',
      source: 'reference',
      paint: {
        'line-color': 'lightblue',
        'line-width': 3,
      },
      'source-layer': 'Chemins',
    },
    {
      id: 'terralego-biens',
      type: 'circle',
      source: 'reference',
      paint: {
        'circle-color': 'pink',
        'circle-radius': 10,
      },
      'source-layer': 'biens',
    },
    {
      id: 'terralego-tampon',
      type: 'fill',
      source: 'reference',
      paint: {
        'fill-color': 'salmon',
      },
      'source-layer': 'tampon',
    },
    {
      id: 'terralego-biens_polygon',
      type: 'fill',
      source: 'reference',
      paint: {
        'fill-color': 'lightgreen',
      },
      'source-layer': 'biens_polygon',
    },
    {
      id: 'terralego-composantes',
      type: 'circle',
      source: 'reference',
      paint: {
        'circle-color': 'crimson',
        'circle-radius': 8,
      },
      'source-layer': 'Composantes',
    },
    {
      id: 'terralego-tourism-location',
      type: 'circle',
      source: 'infoTourism',
      paint: {
        'circle-color': 'crimson',
        'circle-radius': 8,
      },
      'source-layer': 'Lieux d’information',
    },
    {
      id: 'terralego-tourism-content',
      type: 'circle',
      source: 'infoTourism',
      paint: {
        'circle-color': 'crimson',
        'circle-radius': 8,
      },
      'source-layer': 'Contenus touristiques',
    },
    {
      id: 'terralego-tourism-services',
      type: 'circle',
      source: 'infoTourism',
      paint: {
        'circle-color': 'crimson',
        'circle-radius': 8,
      },
      'source-layer': 'Points d’intérêts touristiques',
    },
    {
      id: 'terralego-tourism-observations',
      type: 'circle',
      source: 'infoTourism',
      paint: {
        'circle-color': 'crimson',
        'circle-radius': 8,
      },
      'source-layer': 'Dispositifs d’observation touristique',
    },
    {
      id: 'terralego-culture-mediation',
      type: 'circle',
      source: 'culture',
      paint: {
        'circle-color': 'crimson',
        'circle-radius': 8,
      },
      'source-layer': 'Outils de médiation',
    },
    {
      id: 'terralego-culture-event',
      type: 'circle',
      source: 'culture',
      paint: {
        'circle-color': 'crimson',
        'circle-radius': 8,
      },
      'source-layer': 'Événements',
    },
    {
      id: 'terralego-culture-awareness',
      type: 'circle',
      source: 'culture',
      paint: {
        'circle-color': 'crimson',
        'circle-radius': 8,
      },
      'source-layer': 'Dispositifs de sensibilisation',
    },
    {
      id: 'terralego-culture-participation',
      type: 'circle',
      source: 'culture',
      paint: {
        'circle-color': 'crimson',
        'circle-radius': 8,
      },
      'source-layer': 'Participation à un action',
    },
  ],
};

export default mockedCustomStyle;
